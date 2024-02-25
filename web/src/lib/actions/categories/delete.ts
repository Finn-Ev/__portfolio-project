'use server';

import { fetchBackend } from '@/lib/actions/fetch-backend';

export async function deleteCategory(categoryId: number) {
  return fetchBackend('DELETE', `/categories/${categoryId}`);
}
