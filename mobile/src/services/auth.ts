import { api } from './api';
import { AuthResponse, LoginInput, RegisterInput, User } from '../types';

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', input);
  return data.data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', input);
  return data.data;
}

export async function getProfile(): Promise<{ data: User }> {
  const { data } = await api.get<{ data: User }>('/auth/profile');
  return data;
}

export async function topupBalance(amount: number): Promise<{ data: User }> {
  const { data } = await api.post<{ data: User }>('/auth/topup', { amount });
  return data;
}
