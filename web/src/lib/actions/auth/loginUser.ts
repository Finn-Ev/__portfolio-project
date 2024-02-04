'use server';

import { cookies } from 'next/headers';
import { fetchBackend } from '../fetchBackend';

export async function loginUser(payload: { email: string; password: string }) {
  try {
    const response = await fetchBackend('/auth/login', 'POST', payload);

    const { access_token } = await response.json();

    if (access_token) {
      cookies().set('user_token', access_token, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        httpOnly: true,
      });
      return true;
    }
  } catch (error) {
    throw error; // TODO
  }
}
