'use server';

import { fetchBackend } from '../fetchBackend';

export async function deleteCategory(categoryId: number) {
  return fetchBackend('DELETE', `/categories/${categoryId}`);
}
