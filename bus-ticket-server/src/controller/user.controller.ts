import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { checkEmailExists, checkPhoneExists, insertNewUser, setRefreshToken, setAccessToken } from '../model/user.model';
import { getUserDetails, getBcryptPassword, generateToken } from '../services/user.service';
import { UserType } from '../interfaces/user.interface';


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

  let isEmailExists: boolean = await checkEmailExists(newUser.user_email);   // Checking whether email already exists or not
  if (isEmailExists) return res.status(400).json(new ApiError(400, "Email is already exists !!"));

  const isPhoneExists: boolean = await checkPhoneExists(newUser.user_phone);   // Checking whether phone already exists or not
  if (isPhoneExists) return res.status(400).json(new ApiError(400, "Phone number is already exists !!"));

  let hashPass: string = await getBcryptPassword(newUser.password)  // Here we are hashing the {user_password}
  newUser.password = hashPass;

  let newUserId: number = await insertNewUser(newUser);   // Here we are inserting new user in DB

  let newRefreshToken: string = generateToken(newUserId, newUser.user_type, process.env.REFRESH_TOKEN_KEY as string, process.env.REFRESH_EXPIRY as string);
  let newAccessToken: string = generateToken(newUserId, newUser.user_type, process.env.ACCESS_TOKEN_KEY as string, process.env.ACCESS_EXPIRY as string);

  let currentDateTime: string = new Date().toUTCString();

  let newRefreshTokenId: number = await setRefreshToken({ refresh_token: newRefreshToken, user_id: newUserId, created_on: currentDateTime, updated_on: currentDateTime });   // Here we are setting refresh token in DB
  let newAccessTokenId: number = await setAccessToken({ access_token: newAccessToken, refresh_token_id: newRefreshTokenId, user_id: newUserId, created_on: currentDateTime, updated_on: currentDateTime });    // Here we are setting access token in DB 

  return res.status(200).json(new ApiResponse(200, [], "User created successfully !!"));

});


export { register };