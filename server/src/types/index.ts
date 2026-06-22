import { Currency, PaymentStatus } from '@prisma/client';

export interface RegisterUserInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface CreatePaymentInput {
  amount: number;
  currency: Currency;
  description?: string;
  receiverEmail: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  description: string | null;
  sender: { id: string; name: string; email: string };
  receiver: { id: string; name: string; email: string };
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
