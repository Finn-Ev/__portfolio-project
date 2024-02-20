'use server';

import { fetchBackend } from '../fetch-backend';

export async function updateCategory(
  categoryId: number,
  data: {
    title?: string;
    description?: string;
  },
) {
  return await fetchBackend('PATCH', `/categories/${categoryId}`, data);
}
