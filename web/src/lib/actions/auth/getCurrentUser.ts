'use server';

import { User } from '@/lib/types/user';
import { fetchBackend } from '@/lib/actions/fetch-backend';

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetchBackend<User>('GET', '/users/me');

  if (response.success) {
    return response.value!;
  }

  return null;
}
