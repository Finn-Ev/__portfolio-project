'use server';

import { User } from '../../types/user';
import { fetchBackend } from '../fetchBackend';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetchBackend('GET', '/users/me');

    if (response.status === 200) {
      return response.json();
    }

    return null;
  } catch (error) {
    throw error; // TODO
  }
}
