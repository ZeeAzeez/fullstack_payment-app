import { Response } from 'express';
import httpStatus from 'http-status';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode: number = httpStatus.OK) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(res: Response, error: string, statusCode: number = httpStatus.INTERNAL_SERVER_ERROR) {
  return res.status(statusCode).json({
    success: false,
    error,
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
) {
  return res.status(httpStatus.OK).json({
    success: true,
    data,
    pagination,
  });
}
