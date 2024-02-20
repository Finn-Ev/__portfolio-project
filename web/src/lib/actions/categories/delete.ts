'use server';

import { fetchBackend } from '../fetch-backend';

export async function deleteCategory(categoryId: number) {
  return fetchBackend('DELETE', `/categories/${categoryId}`);
}
