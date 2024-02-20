'use server';

import { fetchBackend } from '../fetch-backend';

export async function createCategory(data: { title: string; description?: string }) {
  return fetchBackend('POST', '/categories', data);
}
