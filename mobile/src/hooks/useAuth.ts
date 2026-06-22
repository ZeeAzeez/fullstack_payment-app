import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as authService from '../services/auth';
import * as storage from '../utils/storage';
import { LoginInput, RegisterInput } from '../types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: async (response) => {
      await storage.setToken(response.token);
      setAuth(response.user, response.token);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: async (response) => {
      await storage.setToken(response.token);
      setAuth(response.user, response.token);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return async () => {
    await storage.removeToken();
    logout();
  };
}

export function useTopup() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (amountCents: number) => authService.topupBalance(amountCents),
    onSuccess: (response) => {
      setUser(response.data as any);
    },
  });
}
