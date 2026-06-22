import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import * as paymentService from '../services/payment';
import * as userService from '../services/user';
import { CreatePaymentInput } from '../types';

const PAYMENTS_KEY = 'payments';
const USERS_KEY = 'users';

export function usePayments() {
  return useInfiniteQuery({
    queryKey: [PAYMENTS_KEY],
    queryFn: ({ pageParam = 1 }) => paymentService.getPayments(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentInput) => paymentService.createPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
    },
  });
}

export function useUserSearch(email: string) {
  return useQuery({
    queryKey: [USERS_KEY, 'search', email],
    queryFn: () => userService.searchUser(email),
    enabled: email.length > 4 && email.includes('@'),
    staleTime: 30_000,
  });
}
