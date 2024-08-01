import { Request, Response, NextFunction } from 'express';
import { redis_cli } from '../db/connect_db';
import { ApiError } from '../utils/ApiError';
import { async_handler } from '../utils/async_handler';
import { get_user_from_token } from '../utils/common_utilites';


/**
 * 
 * @name : authenticate_token
 * @Desc : For authenticate user with access token
 * 
 */


const authenticate_token = async_handler(async (req: Request, res: Response, next: NextFunction) => {
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];

    if (!token) return res.status(401).json(new ApiError(401, 'Please send a token'));   // If user does not send token in the request then rejecting it

    let { user_id, user_type } = get_user_from_token(token, "access_token");    // Reading user details from given refresh token
    
    let permissions = await redis_cli.get(`permissions:${user_type}:${user_id}`);   //  Getting users permissions from redis

    if(permissions) req.body.user_permissions = permissions;    //  If found permissions then will set it in {req.body}

    

    next();

});


export { authenticate_token };