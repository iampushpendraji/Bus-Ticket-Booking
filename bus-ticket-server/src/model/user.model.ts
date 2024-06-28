import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
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
    return rows.length ? true : false;
}


/**
 * 
 * @name : insertNewUser
 * @Desc : 
 * - For inserting new user into DB
 * - This is a transition query so it has a {connection} as a parameter, which can be used if we are using it in transitions
 * 
 */


async function insertNewUser(newUser: UserType, connection: PoolConnection): Promise<number> {
    const [rows] = await connection.query<ResultSetHeader>('INSERT INTO users SET ?', newUser);
    return rows.insertId;
}


/**
 * 
 * @name : setRefreshToken
 * @Desc : 
 * - For inserting new refresh token into DB
 * - This is a transition query so it has a {connection} as a parameter, which can be used if we are using it in transitions
 * 
 */


async function insertRefreshToken(new_refresh_token: { refresh_token: string, user_id: number, created_on: string, updated_on: string }, connection: PoolConnection): Promise<number> {
    const [rows] = await connection.query<ResultSetHeader>('INSERT INTO auth_refresh_token SET ?', new_refresh_token);
    return rows.insertId;
}


/**
 * 
 * @name : setAccessToken
 * @Desc : For inserting new access token into DB
 * 
 */


async function insertAccessToken(new_access_token: { access_token: string, refresh_token_id: number, user_id: number, created_on: string, updated_on: string }, connection: PoolConnection): Promise<number> {
    const [rows] = await connection.query<ResultSetHeader>('INSERT INTO auth_access_token SET ?', new_access_token);
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


async function updateAccessToken(new_access_token: { access_token: string, refresh_token_id: number, user_id: number, updated_on: string }): Promise<number> {
    const [rows] = await pool.query<ResultSetHeader>('UPDATE auth_access_token SET ? WHERE refresh_token_id = ?', [new_access_token, new_access_token.refresh_token_id]);
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
 * @name : deleteAllRefreshTokenOfUser
 * @Desc : For deleting all refresh_token_id from refresh token it will also delete all access_token also from DB because of cascade
 * 
 */


async function deleteAllRefreshTokenOfUser(user_id: number): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>('DELETE FROM auth_refresh_token WHERE user_id = ?', [user_id]);
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


export { getUserFromEmail, checkPhoneExists, insertNewUser, insertRefreshToken, insertAccessToken, updateAccessToken, getRefreshTokenIdFromRefreshToken, deleteRefreshTokenFromRefreshTokenId, deleteAllRefreshTokenOfUser };