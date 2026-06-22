import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PaymentService } from '../services/payment.service';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import httpStatus from 'http-status';

const paymentService = new PaymentService();

export const createPaymentSchema = z.object({
  amount: z.number().int().positive('Amount must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'NGN']).default('USD'),
  description: z.string().max(500).optional(),
  receiverEmail: z.string().email('Invalid receiver email'),
});

export class PaymentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.createPayment(req.user!.userId, req.body);
      sendSuccess(res, payment, 'Payment created', httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await paymentService.getUserPayments(req.user!.userId, page, limit);
      sendPaginated(res, result.payments, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id, req.user!.userId);
      sendSuccess(res, payment);
    } catch (error) {
      next(error);
    }
  }
}
