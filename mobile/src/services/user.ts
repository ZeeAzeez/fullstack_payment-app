import { api } from './api';

interface UserSearchResult {
  found: boolean;
  user: { id: string; name: string; email: string } | null;
}

export async function searchUser(email: string): Promise<UserSearchResult> {
  const { data } = await api.get<{ success: boolean; data: UserSearchResult }>(
    '/users/search',
    { params: { email } },
  );
  return data.data;
}
