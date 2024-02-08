'use server';

import { cookies } from 'next/headers';
import { fetchBackend } from '../fetchBackend';
import { USER_ROOT_CATEGORY_ID_COOKIE_NAME, USER_TOKEN_COOKIE_NAME } from '../../../constants';

export async function register(payload: {
  email: string;
  password: string;
}): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    const response = await fetchBackend<{ access_token: string; root_category_id: number }>(
      'POST',
      '/auth/register',
      payload,
    );

    if (!response.success) {
      return response; // don't need to try to set cookies if the request failed
    }

    const { access_token, root_category_id } = response.value!;

    cookies().set(USER_TOKEN_COOKIE_NAME, access_token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      httpOnly: true,
    });

    cookies().set(USER_ROOT_CATEGORY_ID_COOKIE_NAME, root_category_id.toString(), {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return response;
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}
