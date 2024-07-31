import { Request, Response } from 'express';
import { pool } from '../db/connect_db';
import { PoolConnection } from 'mysql2/promise';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { async_handler } from '../utils/async_handler';
import { get_user_from_email, check_phone_exists, insert_new_user, insert_refresh_token, insert_access_token, update_access_token, get_refresh_token_id_from_refresh_token, delete_refresh_token_from_refresh_token_id, delete_all_refresh_token_of_user } from '../model/user.model';
import { get_user_details, get_bcrypt_password, generate_token, validate_password } from '../services/user.service';
import { get_current_UTC_time, check_all_required_keys_data, get_user_from_token } from '../utils/common_utilites';


/**
 * 
 * @name : register
 * @route : /api/v1/user/register
 * @Desc : 
 * - For inserting new user into DB
 * - Added transitions here
 * 
 */


const register = async_handler(async (req: Request, res: Response) => {
  let body = req.body;
  let required_keys = ["user_first_name", "user_type", "user_last_name", "user_email", "user_phone", "password"];
  let check_required_input = check_all_required_keys_data(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let new_user = get_user_details(body);   // Creating new user object adding user information here

  let user_details = await get_user_from_email(new_user.user_email);   // Checking whether email already exists or not
  if (user_details.length > 0) return res.status(400).json(new ApiError(400, "Email is already exists !!"));

  const is_phone_exists = await check_phone_exists(new_user.user_phone);   // Checking whether phone already exists or not
  if (is_phone_exists) return res.status(400).json(new ApiError(400, "Phone number is already exists !!"));

  new_user.password = await get_bcrypt_password(new_user.password, process.env.PASSWORD_TOKEN_KEY as string)  // Here we are hashing the {user_password}

  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction
    let new_user_id = await insert_new_user(new_user, connection);   // Here we are inserting new user in DB

    let new_refresh_token = generate_token(new_user_id, new_user.user_type, process.env.REFRESH_TOKEN_KEY as string, process.env.REFRESH_EXPIRY as string);   // Here generating json web token
    let new_access_token = generate_token(new_user_id, new_user.user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token

    let current_date_time = get_current_UTC_time();   // Getting UTC current time

    let new_refresh_token_id = await insert_refresh_token({ refresh_token: new_refresh_token, user_id: new_user_id, created_on: current_date_time, updated_on: current_date_time }, connection);   // Here we are setting refresh token in DB
    await insert_access_token({ access_token: new_access_token, refresh_token_id: new_refresh_token_id, user_id: new_user_id, created_on: current_date_time, updated_on: current_date_time }, connection);    // Here we are setting access token in DB 

    await connection.commit();    // Commit transaction
    return res.status(201).json(new ApiResponse(201, { user_id: new_user_id, refresh_token: new_refresh_token, access_token: new_access_token }, "User created successfully !!"));
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
 * @name : sign_in
 * @route : /api/v1/user/sign_in
 * @Desc : 
 * - For sign_in
 * - Added transitions here
 * 
 */


const sign_in = async_handler(async (req: Request, res: Response) => {
  let { user_email, password } = req.body;
  let body = req.body;
  let required_keys = ["user_email", "password"];
  let check_required_input = check_all_required_keys_data(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = await get_user_from_email(user_email);   // Checking whether email already exists or not
  if (user_details.length == 0) return res.status(400).json(new ApiError(400, "Email does not exists !!"));

  let pass_check = await validate_password(user_details[0].password, password, process.env.PASSWORD_TOKEN_KEY as string);   // Validating password
  if (!pass_check) return res.status(400).json(new ApiError(400, "Password is invalid !!"));

  let new_refresh_token = generate_token(user_details[0].id, user_details[0].user_type, process.env.REFRESH_TOKEN_KEY as string, process.env.REFRESH_EXPIRY as string);   // Here generating json web token
  let new_access_token = generate_token(user_details[0].id, user_details[0].user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token

  let current_date_time = get_current_UTC_time();   // Getting UTC current time

  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction
    let newRefreshTokenId = await insert_refresh_token({ refresh_token: new_refresh_token, user_id: user_details[0].id, created_on: current_date_time, updated_on: current_date_time }, connection);   // Here we are setting refresh token in DB
    await insert_access_token({ access_token: new_access_token, refresh_token_id: newRefreshTokenId, user_id: user_details[0].id, created_on: current_date_time, updated_on: current_date_time }, connection);    // Here we are setting access token in DB 
    await connection.commit();    // Commit transaction
    return res.status(200).json(new ApiResponse(200, { user_id: user_details[0].id, user_type: user_details[0].user_type, refresh_token: new_refresh_token, access_token: new_access_token }, "User authenticated successfully !!"));
  }
  catch (error) {
    if (connection) {
      await connection.rollback();    // Rollback transaction on error
      return res.status(400).json(new ApiError(400, 'Error in sign_in !!'));
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
 * @name : access_token_from_refresh_token
 * @route : /api/v1/user/access_token_from_refresh_token
 * @Desc : For getting access token from refresh token
 * 
 */


const access_token_from_refresh_token = async_handler(async (req: Request, res: Response) => {
  let { refresh_token } = req.query;
  let body = req.query;
  let required_keys = ["refresh_token"];
  let check_required_input = check_all_required_keys_data(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = get_user_from_token(refresh_token as string, "refresh_token");    // Reading user details from given refresh token

  let find_refresh_token = await get_refresh_token_id_from_refresh_token(refresh_token as string, user_details.user_id);   // Finding refresh token exists or not in table
  if (find_refresh_token.length == 0) return res.status(400).json(new ApiError(400, "Refresh token does not exists !!"));

  let new_access_token = generate_token(user_details.user_id, user_details.user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token
  let current_date_time = get_current_UTC_time();   // Getting UTC current time
  await update_access_token({ access_token: new_access_token, refresh_token_id: find_refresh_token[0].id, user_id: user_details.user_id, updated_on: current_date_time });    // Here we are setting access token relate to refresh_token_id in DB 

  return res.status(200).json(new ApiResponse(200, { user_id: user_details.user_id, refresh_token: refresh_token, access_token: new_access_token }, "Generated access token successfully !!"));
});


/**
 * 
 * @name : sign_out
 * @route : /api/v1/user/sign_out
 * @Desc : 
 * - For deleting refresh token
 * - For deleting access token related to refresh token
 * 
 */


const sign_out = async_handler(async (req: Request, res: Response) => {
  let { refresh_token } = req.body;
  let body = req.body;
  let required_keys = ["refresh_token"];
  let check_required_input = check_all_required_keys_data(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = get_user_from_token(refresh_token as string, "refresh_token");    // Reading user details from given refresh token

  let findRefreshToken = await get_refresh_token_id_from_refresh_token(refresh_token, user_details.user_id);   // Finding refresh token exists or not in table
  if (findRefreshToken.length == 0) return res.status(400).json(new ApiError(400, "Refresh token does not exists !!"));

  await delete_refresh_token_from_refresh_token_id(findRefreshToken[0].id);   // Deleting refresh token it will also delete accesstoken because cascade delete
  return res.status(204).json(new ApiResponse(204, {}, "User logged out successfully !!"));
});


/**
 * 
 * @name : sign_out_all
 * @route : /api/v1/user/sign_out_all
 * @Desc : For deleting refresh token and access token for a user
 * 
 */


const sign_out_all = async_handler(async (req: Request, res: Response) => {
  let { refresh_token } = req.body;
  let body = req.body;
  let required_keys = ["refresh_token"];
  let check_required_input = check_all_required_keys_data(body, required_keys);   // Checking whether we have got all the require inputs from request
  if (!check_required_input.status) return res.status(400).json(new ApiError(400, "Please send all the require inputs", [{ not_exists_key: check_required_input.not_exists_keys, not_exists_value: check_required_input.not_exists_value }]));

  let user_details = get_user_from_token(refresh_token, "refresh_token");    // Reading user details from given refresh token

  await delete_all_refresh_token_of_user(user_details.user_id);   // Deleting refresh token from table
  return res.status(204).json(new ApiResponse(204, {}, "User logged out from all the devices !!"));
});


export { register, sign_in, access_token_from_refresh_token, sign_out, sign_out_all };