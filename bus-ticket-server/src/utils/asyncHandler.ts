import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from './apiError';


/**
 * 
 * @name : asyncHandler
 * @Desc : 
 * - This method is a middleware method if we get any error inside it then it will return error response
 * - Every controller has to go from this check
 * 
 */


const asyncHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => res.status(500).json(new ApiError(500, 'Something went wrong !!', err)) );
    };
};


export { asyncHandler };