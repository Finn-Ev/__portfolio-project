'use server';

import { fetchBackend } from '../fetchBackend';

export async function getCurrentUser() {
  try {
    const response = await fetchBackend('/users/me', 'GET', null);

    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    throw error; // TODO
  }
}
