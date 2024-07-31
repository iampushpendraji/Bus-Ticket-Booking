import { UserType } from "../interfaces/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { get_current_UTC_time } from "../utils/common_utilites";


/**
 * 
 * @name : get_user_details
 * @Desc : For generating user details
 * 
 */


function get_user_details(body: UserType): UserType {
    return {
        user_first_name: body.user_first_name,
        user_type: body.user_type,
        user_last_name: body.user_last_name,
        user_email: body.user_email,
        user_phone: body.user_phone,
        password: body.password,
        created_on: get_current_UTC_time(),
        updated_on: get_current_UTC_time(),
        is_active: 1
    };
}


/**
 * 
 * @name : generate_token
 * @Desc : For generating token
 * 
 */


function generate_token(user_id: number, user_type: string, token_key: string, expires_in: string): string {
    return jwt.sign({ user_id: user_id, user_type: user_type }, token_key, { expiresIn: expires_in });
}


/**
 * 
 * @name : get_bcrypt_password
 * @Desc : 
 * - For generating bcrypt password
 * - Using public key for encoding the password
 * 
 */


async function get_bcrypt_password(password: string, token_key: string): Promise<string> {
    const hashed_password = await bcrypt.hash(password, 10),
        token = jwt.sign(hashed_password, token_key);
    return token;
}


/**
 * 
 * @name : validate_password
 * @Desc : For validating password
 * 
 */


async function validate_password(db_password: string, user_password: string, token_key: string): Promise<boolean> {
    const pass1 = jwt.verify(db_password, token_key) as string;
    let pass2 = user_password;      // It will be string
    let passCheck = await bcrypt.compare(pass2, pass1);  // Validating password here
    return passCheck;
}

export { get_user_details, generate_token, get_bcrypt_password, validate_password };