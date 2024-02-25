'use server';

import { fetchBackend } from '@/lib/actions/fetch-backend';

export async function createCategory(data: { title: string; description?: string }) {
  return fetchBackend('POST', '/categories', data);
}
