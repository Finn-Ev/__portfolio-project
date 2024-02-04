'use server';

import { cookies } from 'next/headers';

export async function logoutUser() {
  cookies().set('user_token', '', {
    maxAge: -1,
  });
}
