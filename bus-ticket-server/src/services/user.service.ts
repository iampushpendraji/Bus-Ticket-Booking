import { UserType, TokenUserDetail } from "../interfaces/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/**
 * 
 * @name : getUserDetails
 * @Desc : For generating user details
 * 
 */


function getUserDetails(body: UserType): UserType {
    return {
        user_first_name: body.user_first_name,
        user_type: body.user_type,
        user_last_name: body.user_last_name,
        user_email: body.user_email,
        user_phone: body.user_phone,
        password: body.password,
        created_on: new Date().getTime(),
        updated_on: new Date().getTime(),
        is_active: 1
    };
}


/**
 * 
 * @name : generateToken
 * @Desc : For generating token
 * 
 */


function generateToken(user_id: number, user_type: string, token_key: string, expires_in: string): string {
    return jwt.sign({ user_id: user_id, user_type: user_type }, token_key, { expiresIn: expires_in });
}


/**
 * 
 * @name : getBcryptPassword
 * @Desc : For generating bcrypt password
 * 
 */


async function getBcryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}


/**
 * 
 * @name : validatePassword
 * @Desc : For validating password
 * 
 */


async function validatePassword(bcrypted_password: string, password: string): Promise<boolean> {
    let passCheck = await bcrypt.compare(password, bcrypted_password);  // Validating password here
    return passCheck;
}


/**
 * 
 * @name : getUserFromToken
 * @Desc : For getting user details from token
 * 
 */


function getUserFromToken(token: string, token_type: string): TokenUserDetail {
    let token_key: string = token_type === "refresh_token" ? process.env.REFRESH_TOKEN_KEY as string : process.env.ACCESS_TOKEN_KEY as string;
    let data: TokenUserDetail = jwt.verify(token, token_key) as TokenUserDetail;
    return data;
}

export { getUserDetails, generateToken, getBcryptPassword, validatePassword, getUserFromToken };