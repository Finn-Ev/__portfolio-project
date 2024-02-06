'use server';

import { cookies } from 'next/headers';
import { USER_ROOT_CATEGORY_ID_COOKIE_NAME, USER_TOKEN_COOKIE_NAME } from '../../../constants';

export async function logout() {
  cookies().set(USER_TOKEN_COOKIE_NAME, '', {
    maxAge: -1,
  });

  cookies().set(USER_ROOT_CATEGORY_ID_COOKIE_NAME, '', {
    maxAge: -1,
  });
}
