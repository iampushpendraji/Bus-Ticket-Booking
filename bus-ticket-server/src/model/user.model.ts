import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'; 
import { pool } from "../db/connectDB";
import { UserType } from "../interfaces/user.interface";


/**
 * 
 * @name : getUserFromEmail
 * @Desc : For getting user's details on the basis of email
 * 
 */


async function getUserFromEmail(user_email: string): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE user_email = ?', [user_email]);
    return rows;
}


/**
 * 
 * @name : checkPhoneExists
 * @Desc : For checking phone number exists in table
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


/**
 * 
 * @name : updateAccessToken
 * @Desc : 
 * - For updating new access token into DB
 * - We will use it for replacing expired access token with new access token
 * 
 */


async function updateAccessToken(newAccessToken: { access_token: string, refresh_token_id: number, user_id: number, updated_on: string }): Promise<number> {
    const [rows] = await pool.query<ResultSetHeader>('UPDATE auth_access_token SET ? WHERE refresh_token_id = ?', [newAccessToken, newAccessToken.refresh_token_id]);
    return rows.insertId;
}


/**
 * 
 * @name : getRefreshTokenIdFromRefreshToken
 * @Desc : For getting refresh_token_id from refresh token
 * 
 */


async function getRefreshTokenIdFromRefreshToken(refresh_token: string, user_id: number): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM auth_refresh_token WHERE refresh_token = ? AND user_id = ?', [refresh_token, user_id]);
    return rows;
}


/**
 * 
 * @name : getRefreshTokenIdFromRefreshToken
 * @Desc : For getting refresh_token_id from refresh token
 * 
 */


async function deleteRefreshTokenFromRefreshTokenId(refresh_token_id: number): Promise<ResultSetHeader> {
    const [rows] = await pool.query<ResultSetHeader>('DELETE FROM auth_refresh_token WHERE id = ?', [refresh_token_id]);
    return rows;
}


export { getUserFromEmail, checkPhoneExists, insertNewUser, setRefreshToken, setAccessToken, updateAccessToken, getRefreshTokenIdFromRefreshToken, deleteRefreshTokenFromRefreshTokenId };