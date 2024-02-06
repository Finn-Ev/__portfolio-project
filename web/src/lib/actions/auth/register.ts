'use server';

import { cookies } from 'next/headers';
import { fetchBackend } from '../fetchBackend';
import { USER_ROOT_CATEGORY_ID_COOKIE_NAME, USER_TOKEN_COOKIE_NAME } from '../../../constants';

export async function register(payload: { email: string; password: string }) {
  try {
    const response = await fetchBackend('POST', '/auth/register', payload);

    const { access_token, root_category_id } = await response.json();

    if (access_token) {
      cookies().set(USER_TOKEN_COOKIE_NAME, access_token, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        httpOnly: true,
      });

      cookies().set(USER_ROOT_CATEGORY_ID_COOKIE_NAME, root_category_id, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      });

      return true;
    }
  } catch (error) {
    throw error; // TODO
  }
}
