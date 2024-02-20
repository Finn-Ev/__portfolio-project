'use server';

import { fetchBackend } from '../fetchBackend';

export async function createCategory(data: { title: string; description?: string }) {
  return fetchBackend('POST', '/categories', data);
}
