'use server';

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

import { cookies } from 'next/headers';

export async function fetchBackend<T>(
  method: HttpMethod,
  path: string,
  payload: any = null,
): Promise<{ success: boolean; value?: T; errorMessage?: string }> {
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
    // console.log('fetching', process.env.NEXT_PUBLIC_BACKEND_URL + path, options);

    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + path, options);

    const responseBody = await response.json();

    if (!response.ok) {
      return { success: false, errorMessage: responseBody.message };
    }

    return { success: true, value: responseBody as T };
  } catch (error) {
    return { success: false, errorMessage: (error as Error).message };
  }
}
