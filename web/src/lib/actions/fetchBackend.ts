'use server';

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

import { cookies } from 'next/headers';

export async function fetchBackend(method: HttpMethod, path: string, payload: any = null) {
  const accessToken = cookies().get('user_token')?.value;

  const options: RequestInit = {
    cache: 'no-store',
    method: method,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

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
