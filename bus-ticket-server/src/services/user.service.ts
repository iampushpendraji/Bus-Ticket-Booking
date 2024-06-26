import { UserType } from "../interfaces/user.interface";
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

export { getUserDetails, generateToken, getBcryptPassword, validatePassword };