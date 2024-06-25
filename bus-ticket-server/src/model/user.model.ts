import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'; 
import { pool } from "../db/connectDB";
import { UserType } from "../interfaces/user.interface";


/**
 * 
 * @name : checkEmailExists
 * @Desc : For checking existing email
 * 
 */


async function checkEmailExists(user_email: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE user_email = ?', [user_email]);
    return rows.length ? true: false;
}


/**
 * 
 * @name : checkPhoneExists
 * @Desc : For checking existing phone number
 * 
 */


async function checkPhoneExists(user_phone: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE user_phone = ?', [user_phone]);
    return rows.length ? true: false;
}


/**
 * 
 * @name : insertNewUser
 * @Desc : For inserting new user into DB
 * 
 */


async function insertNewUser(newUser: UserType): Promise<number> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO users SET ?', newUser);
    return rows.insertId;
}


/**
 * 
 * @name : setRefreshToken
 * @Desc : For inserting new refresh token into DB
 * 
 */


async function setRefreshToken(newRefreshToken: { refresh_token: string, user_id: number, created_on: string, updated_on: string }): Promise<number> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO auth_refresh_token SET ?', newRefreshToken);
    return rows.insertId;
}


/**
 * 
 * @name : setAccessToken
 * @Desc : For inserting new access token into DB
 * 
 */


async function setAccessToken(newAccessToken: { access_token: string, refresh_token_id: number, user_id: number, created_on: string, updated_on: string }): Promise<number> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO auth_access_token SET ?', newAccessToken);
    return rows.insertId;
}


export { checkEmailExists, checkPhoneExists, insertNewUser, setRefreshToken, setAccessToken };