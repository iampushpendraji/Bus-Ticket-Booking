import { UserType, TokenUserDetail } from "../interfaces/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { get_current_UTC_time } from "../utils/common_utilites";
import fs from "fs";
import * as path from 'path';


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


async function get_bcrypt_password(password: string): Promise<string> {
    const private_key_path = path.join(__dirname, '../keys', 'private.pem'),    // Getting public key path
        token_key = fs.readFileSync(private_key_path),
        hashed_password: string = await bcrypt.hash(password, 10),
        token = jwt.sign(hashed_password, token_key, { algorithm: 'RS256' });
    return token;
}


/**
 * 
 * @name : decrypt_password
 * @Desc : 
 * - For decrypting password
 * - Using private key for decoding the password
 * 
 */


function decrypt_password(password: string): { status: boolean, pass: string, error_message?: string } {
    try {
        const public_key_path = path.join(__dirname, '../keys', 'public.pem'),    // Getting private key path
            token_key = fs.readFileSync(public_key_path),
            data = jwt.verify(password, token_key, { algorithms: ['RS256'] }) as string;
        return { status: true, pass: data };
    }
    catch (err) {
        return { status: false, pass: '', error_message: 'Please send encrypted password !!' };
    }
}


/**
 * 
 * @name : validate_password
 * @Desc : For validating password
 * 
 */


async function validate_password(db_password: string, user_password: string): Promise<boolean> {
    let pass1 = decrypt_password(db_password);    // It will be bcrypted password
    if (!pass1.status) return false;
    let pass2 = decrypt_password(user_password);      // It will be string
    if (!pass2.status) return false;
    let passCheck = await bcrypt.compare(pass2.pass, pass1.pass);  // Validating password here
    return passCheck;
}


/**
 * 
 * @name : get_user_from_token
 * @Desc : For getting user details from token
 * 
 */


function get_user_from_token(token: string, token_type: string): TokenUserDetail {
    let token_key: string = token_type === "refresh_token" ? process.env.REFRESH_TOKEN_KEY as string : process.env.ACCESS_TOKEN_KEY as string;
    let data: TokenUserDetail = jwt.verify(token, token_key) as TokenUserDetail;
    return data;
}

export { get_user_details, generate_token, get_bcrypt_password, validate_password, get_user_from_token, decrypt_password };