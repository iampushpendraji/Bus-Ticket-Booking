import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserFromEmail, checkPhoneExists, insertNewUser, setRefreshToken, setAccessToken, updateAccessToken, getRefreshTokenIdFromRefreshToken } from '../model/user.model';
import { getUserDetails, getBcryptPassword, generateToken, validatePassword, getUserFromToken } from '../services/user.service';
import { TokenUserDetail, UserType } from '../interfaces/user.interface';


/**
 * 
 * @name : register
 * @route : /api/v1/user/register
 * @Desc : For inserting new user into DB
 * 
 */


const register = asyncHandler(async (req: Request, res: Response) => {
  let body = req.body;
  let newUser: UserType = getUserDetails(body);   // Creating new user object adding user information here

  let userDetails: RowDataPacket[] = await getUserFromEmail(newUser.user_email);   // Checking whether email already exists or not
  if (userDetails.length > 0) return res.status(400).json(new ApiError(400, "Email is already exists !!"));

  const isPhoneExists: boolean = await checkPhoneExists(newUser.user_phone);   // Checking whether phone already exists or not
  if (isPhoneExists) return res.status(400).json(new ApiError(400, "Phone number is already exists !!"));

  let hashPass: string = await getBcryptPassword(newUser.password)  // Here we are hashing the {user_password}
  newUser.password = hashPass;

  let newUserId: number = await insertNewUser(newUser);   // Here we are inserting new user in DB

  let newRefreshToken: string = generateToken(newUserId, newUser.user_type, process.env.REFRESH_TOKEN_KEY as string, process.env.REFRESH_EXPIRY as string);   // Here generating json web token
  let newAccessToken: string = generateToken(newUserId, newUser.user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token

  let currentDateTime: string = new Date().toUTCString();   // Getting UTC current time

  let newRefreshTokenId: number = await setRefreshToken({ refresh_token: newRefreshToken, user_id: newUserId, created_on: currentDateTime, updated_on: currentDateTime });   // Here we are setting refresh token in DB
  let newAccessTokenId: number = await setAccessToken({ access_token: newAccessToken, refresh_token_id: newRefreshTokenId, user_id: newUserId, created_on: currentDateTime, updated_on: currentDateTime });    // Here we are setting access token in DB 

  return res.status(200).json(new ApiResponse(200, { user_id: newUserId, refresh_token: newRefreshToken, access_token: newAccessToken }, "User created successfully !!"));
});


/**
 * 
 * @name : login
 * @route : /api/v1/user/login
 * @Desc : For login
 * 
 */


const login = asyncHandler(async (req: Request, res: Response) => {
  let { user_email, password } = req.body;
  let userDetails: RowDataPacket[] = await getUserFromEmail(user_email);   // Checking whether email already exists or not
  if (userDetails.length == 0) return res.status(400).json(new ApiError(400, "Email does not exists !!"));

  let passCheck: boolean = await validatePassword(userDetails[0].password, password);   // Validating password
  if (!passCheck) return res.status(400).json(new ApiError(400, "Password is invalid !!"));

  let newRefreshToken: string = generateToken(userDetails[0].id, userDetails[0].user_type, process.env.REFRESH_TOKEN_KEY as string, process.env.REFRESH_EXPIRY as string);   // Here generating json web token
  let newAccessToken: string = generateToken(userDetails[0].id, userDetails[0].user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token

  let currentDateTime: string = new Date().toUTCString();   // Getting UTC current time

  let newRefreshTokenId: number = await setRefreshToken({ refresh_token: newRefreshToken, user_id: userDetails[0].id, created_on: currentDateTime, updated_on: currentDateTime });   // Here we are setting refresh token in DB
  let newAccessTokenId: number = await setAccessToken({ access_token: newAccessToken, refresh_token_id: newRefreshTokenId, user_id: userDetails[0].id, created_on: currentDateTime, updated_on: currentDateTime });    // Here we are setting access token in DB 

  return res.status(200).json(new ApiResponse(200, { user_id: userDetails[0].id, refresh_token: newRefreshToken, access_token: newAccessToken }, "User authenticated successfully !!"));
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

  let userDetails: TokenUserDetail = getUserFromToken(refresh_token as string, "refresh_token");    // Reading user details from given refresh token

  let findRefreshToken: RowDataPacket[] = await getRefreshTokenIdFromRefreshToken(refresh_token as string, userDetails.user_id);   // Finding refresh token exists or not in table
  if (findRefreshToken.length == 0) return res.status(400).json(new ApiError(400, "Refresh token does not exists !!"));

  let newAccessToken: string = generateToken(userDetails.user_id, userDetails.user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);    // Here generating json web token
  let currentDateTime: string = new Date().toUTCString();   // Getting UTC current time
  let newAccessTokenId: number = await updateAccessToken({ access_token: newAccessToken, refresh_token_id: findRefreshToken[0].id, user_id: userDetails.user_id, updated_on: currentDateTime });    // Here we are setting access token relate to refresh_token_id in DB 

  return res.status(200).json(new ApiResponse(200, { user_id: userDetails.user_id, refresh_token: refresh_token, access_token: newAccessToken }, "Generated access token successfully !!"));
});

export { register, login, accessTokenFromRefreshToken };