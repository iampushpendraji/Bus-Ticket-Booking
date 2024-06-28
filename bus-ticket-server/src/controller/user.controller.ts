import { Request, Response } from 'express';
import { pool } from '../db/connectDB';
import { PoolConnection } from 'mysql2/promise';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserFromEmail, checkPhoneExists, insertNewUser, insertRefreshToken, insertAccessToken, updateAccessToken, getRefreshTokenIdFromRefreshToken, deleteRefreshTokenFromRefreshTokenId, deleteAllRefreshTokenOfUser } from '../model/user.model';
import { getUserDetails, getBcryptPassword, generateToken, validatePassword, getUserFromToken, decryptPassword } from '../services/user.service';
import { getCurrentUTCTime, checkAllRequiredKeysData } from '../utils/commonUtilites';


/**
 * 
 * @name : register
 * @route : /api/v1/user/register
 * @Desc : 
 * - For inserting new user into DB
 * - Added transitions here
 * 
 */


const register = asyncHandler(async (req: Request, res: Response) => {
  let body = req.body;
  let required_keys = ["user_first_name", "user_type", "user_last_name", "user_email", "user_phone", "password"];
  let check_required_data = checkAllRequiredKeysData(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_data.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_data.not_exists_keys, not_exists_value: check_required_data.not_exists_value }]));

  let new_user = getUserDetails(body);   // Creating new user object adding user information here

  let dcrypted_pass = decryptPassword(new_user.password, process.env.PASSWORD_TOKEN_KEY as string);   // Decrypting password here
  if (!dcrypted_pass.status) return res.status(400).send(new ApiError(400, dcrypted_pass.error_message)); // If user put wonge password or decrypted password directly
  new_user.password = dcrypted_pass.pass;

  let user_details = await getUserFromEmail(new_user.user_email);   // Checking whether email already exists or not
  if (user_details.length > 0) return res.status(400).json(new ApiError(400, "Email is already exists !!"));

  const is_phone_exists = await checkPhoneExists(new_user.user_phone);   // Checking whether phone already exists or not
  if (is_phone_exists) return res.status(400).json(new ApiError(400, "Phone number is already exists !!"));

  new_user.password = await getBcryptPassword(new_user.password, process.env.PASSWORD_TOKEN_KEY as string)  // Here we are hashing the {user_password}

  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    let new_user_id = await insertNewUser(new_user, connection);   // Here we are inserting new user in DB

    let new_refresh_token = generateToken(new_user_id, new_user.user_type, process.env.REFRESH_TOKEN_KEY as string, process.env.REFRESH_EXPIRY as string);   // Here generating json web token
    let new_access_token = generateToken(new_user_id, new_user.user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token

    let current_date_time = getCurrentUTCTime();   // Getting UTC current time

    let new_refresh_token_id = await insertRefreshToken({ refresh_token: new_refresh_token, user_id: new_user_id, created_on: current_date_time, updated_on: current_date_time }, connection);   // Here we are setting refresh token in DB
    await insertAccessToken({ access_token: new_access_token, refresh_token_id: new_refresh_token_id, user_id: new_user_id, created_on: current_date_time, updated_on: current_date_time }, connection);    // Here we are setting access token in DB 

    await connection.commit();    // Commit transaction
    return res.status(200).json(new ApiResponse(200, { user_id: new_user_id, refresh_token: new_refresh_token, access_token: new_access_token }, "User created successfully !!"));
  }
  catch (err) {
    if (connection) {
      await connection.rollback();    // Rollback transaction on error
      return res.status(400).json(new ApiError(400, 'Error in registrations !!'));
    }
  }
  finally {
    if (connection) {
      connection.release();   // Released the connection finally
    }
  }
});


/**
 * 
 * @name : login
 * @route : /api/v1/user/login
 * @Desc : 
 * - For login
 * - Added transitions here
 * 
 */


const login = asyncHandler(async (req: Request, res: Response) => {
  let { user_email, password } = req.body;
  let body = req.body;
  let required_keys = ["user_email", "password"];
  let check_required_input = checkAllRequiredKeysData(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = await getUserFromEmail(user_email);   // Checking whether email already exists or not
  if (user_details.length == 0) return res.status(400).json(new ApiError(400, "Email does not exists !!"));

  let pass_check = await validatePassword(user_details[0].password, password, process.env.PASSWORD_TOKEN_KEY as string);   // Validating password
  if (!pass_check) return res.status(400).json(new ApiError(400, "Password is invalid !!"));

  let new_refresh_token = generateToken(user_details[0].id, user_details[0].user_type, process.env.REFRESH_TOKEN_KEY as string, process.env.REFRESH_EXPIRY as string);   // Here generating json web token
  let new_access_token = generateToken(user_details[0].id, user_details[0].user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token

  let current_date_time = getCurrentUTCTime();   // Getting UTC current time

  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    let newRefreshTokenId = await insertRefreshToken({ refresh_token: new_refresh_token, user_id: user_details[0].id, created_on: current_date_time, updated_on: current_date_time }, connection);   // Here we are setting refresh token in DB
    await insertAccessToken({ access_token: new_access_token, refresh_token_id: newRefreshTokenId, user_id: user_details[0].id, created_on: current_date_time, updated_on: current_date_time }, connection);    // Here we are setting access token in DB 
    await connection.commit();    // Commit transaction
    return res.status(200).json(new ApiResponse(200, { user_id: user_details[0].id, refresh_token: new_refresh_token, access_token: new_access_token }, "User authenticated successfully !!"));
  }
  catch (error) {
    if (connection) {
      await connection.rollback();    // Rollback transaction on error
      return res.status(400).json(new ApiError(400, 'Error in login !!'));
    }
  }
  finally {
    if (connection) {
      connection.release();   // Released the connection finally
    }
  }
});


/**
 * 
 * @name : accessTokenFromRefreshToken
 * @route : /api/v1/user/accessTokenFromRefreshToken
 * @Desc : For getting access token from refresh token
 * 
 */


const accessTokenFromRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  let { refresh_token } = req.query;
  let body = req.query;
  let required_keys = ["refresh_token"];
  let check_required_input = checkAllRequiredKeysData(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = getUserFromToken(refresh_token as string, "refresh_token");    // Reading user details from given refresh token

  let find_refresh_token = await getRefreshTokenIdFromRefreshToken(refresh_token as string, user_details.user_id);   // Finding refresh token exists or not in table
  if (find_refresh_token.length == 0) return res.status(400).json(new ApiError(400, "Refresh token does not exists !!"));

  let new_access_token = generateToken(user_details.user_id, user_details.user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token
  let current_date_time = getCurrentUTCTime();   // Getting UTC current time
  await updateAccessToken({ access_token: new_access_token, refresh_token_id: find_refresh_token[0].id, user_id: user_details.user_id, updated_on: current_date_time });    // Here we are setting access token relate to refresh_token_id in DB 

  return res.status(200).json(new ApiResponse(200, { user_id: user_details.user_id, refresh_token: refresh_token, access_token: new_access_token }, "Generated access token successfully !!"));
});


/**
 * 
 * @name : logout
 * @route : /api/v1/user/logout
 * @Desc : 
 * - For deleting refresh token
 * - For deleting access token related to refresh token
 * 
 */


const logout = asyncHandler(async (req: Request, res: Response) => {
  let { refresh_token } = req.body;
  let body = req.body;
  let required_keys = ["refresh_token"];
  let check_required_input = checkAllRequiredKeysData(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = getUserFromToken(refresh_token as string, "refresh_token");    // Reading user details from given refresh token

  let findRefreshToken = await getRefreshTokenIdFromRefreshToken(refresh_token, user_details.user_id);   // Finding refresh token exists or not in table
  if (findRefreshToken.length == 0) return res.status(400).json(new ApiError(400, "Refresh token does not exists !!"));

  await deleteRefreshTokenFromRefreshTokenId(findRefreshToken[0].id);   // Deleting refresh token it will also delete accesstoken because cascade delete
  return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully !!"));
});


/**
 * 
 * @name : logoutAll
 * @route : /api/v1/user/logoutAll
 * @Desc : For deleting refresh token and access token for a user
 * 
 */


const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  let { refresh_token } = req.body;
  let body = req.body;
  let required_keys = ["refresh_token"];
  let check_required_input = checkAllRequiredKeysData(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = getUserFromToken(refresh_token, "refresh_token");    // Reading user details from given refresh token

  await deleteAllRefreshTokenOfUser(user_details.user_id);   // Deleting refresh token from table
  return res.status(200).json(new ApiResponse(200, {}, "User logged out from all the devices !!"));
});


export { register, login, accessTokenFromRefreshToken, logout, logoutAll };