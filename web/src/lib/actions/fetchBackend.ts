'use server';

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

import { cookies } from 'next/headers';

export async function fetchBackend(path: string, method: HttpMethod, payload: any = null) {
  const accessToken = cookies().get('user_token')?.value;

  // set up the basic fetch options
  const options: RequestInit = {
    cache: 'no-store',
    method: method,
    credentials: 'include',
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  // set up the headers
  const headers: HeadersInit = {};

  if (payload) {
    headers['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  options.headers = headers;

  try {
    return fetch(process.env.NEXT_PUBLIC_BACKEND_URL + path, options);
  } catch (error) {
    throw error;
  }
}
