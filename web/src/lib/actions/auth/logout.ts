'use server';

import { cookies } from 'next/headers';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';

export async function logout() {
  cookies().set(USER_TOKEN_COOKIE_NAME, '', {
    maxAge: -1,
  });
}
