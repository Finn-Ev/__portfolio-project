'use server';

import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/actions//fetch-backend';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';

type AuthResponse = { access_token: string; root_category_id: number };

export async function authenticateUser(
  payload: {
    email: string;
    password: string;
  },
  isNewUser: boolean = false,
): Promise<{ success: boolean; errorCode?: string }> {
  const urlPath = isNewUser ? '/auth/register' : '/auth/login';

  try {
    const response = await fetchBackend<AuthResponse>('POST', urlPath, payload);

    if (!response.success) {
      return response;
    }

    const { access_token } = response.value!;

    cookies().set(USER_TOKEN_COOKIE_NAME, access_token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      httpOnly: true,
    });

    return response;
  } catch (error) {
    return { success: false, errorCode: (error as Error).message };
  }
}
