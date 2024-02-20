'use server';

import { fetchBackend } from '../fetch-backend';

export async function updateBookmark(
  bookmarkId: number,
  data: {
    title?: string;
    link?: string;
    categoryId?: number;
    description?: string;
  },
) {
  return await fetchBackend('PATCH', `/bookmarks/${bookmarkId}`, data);
}
