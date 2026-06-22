import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import httpStatus from 'http-status';

const authService = new AuthService();

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 'Registration successful', httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async topup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.topupBalance(req.user!.userId, req.body.amount);
      sendSuccess(res, user, 'Balance updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const topupSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .int('Amount must be an integer (cents)')
    .positive('Amount must be positive'),
});
