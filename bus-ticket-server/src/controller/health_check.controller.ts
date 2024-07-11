import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { async_handler } from '../utils/asyncHandler';

const health_check = async_handler(async (req: Request, res: Response) => {
  return res.status(200).json(new ApiResponse(200, "OK", "Health check passed!!"))
});

export { health_check };
