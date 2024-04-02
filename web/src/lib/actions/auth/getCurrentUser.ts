'use server';

import { User } from '../../types/user';
import { fetchBackend } from '../fetch-backend';

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetchBackend<User>('GET', '/users/me');

  if (response.success) {
    return response.value!;
  }

  return null;
}
