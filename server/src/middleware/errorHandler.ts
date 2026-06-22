import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/apiResponse';
import { config } from '../config';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  console.error('Unhandled error:', err);

  return sendError(
    res,
    config.isDev ? err.message : 'Internal server error',
    500,
  );
}
