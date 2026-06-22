export type Currency = 'USD' | 'EUR' | 'GBP' | 'NGN';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  description: string | null;
  sender: { id: string; name: string; email: string };
  receiver: { id: string; name: string; email: string };
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface CreatePaymentInput {
  amount: number;
  currency: Currency;
  description?: string;
  receiverEmail: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'NGN';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
