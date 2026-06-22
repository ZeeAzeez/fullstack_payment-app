import { api } from './api';
import { CreatePaymentInput, Payment, PaginatedResponse } from '../types';

export async function createPayment(input: CreatePaymentInput): Promise<{ data: Payment }> {
  const { data } = await api.post<{ data: Payment }>('/payments', input);
  return data;
}

export async function getPayments(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Payment>> {
  const { data } = await api.get<PaginatedResponse<Payment>>('/payments', {
    params: { page, limit },
  });
  return data;
}

export async function getPaymentById(id: string): Promise<{ data: Payment }> {
  const { data } = await api.get<{ data: Payment }>(`/payments/${id}`);
  return data;
}
