import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const paymentSchema = z.object({
  receiverEmail: z.string().min(1, 'Receiver email is required').email('Invalid email'),
  amount: z.number({ invalid_type_error: 'Amount is required' }).positive('Amount must be positive'),
  description: z.string().max(500).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
