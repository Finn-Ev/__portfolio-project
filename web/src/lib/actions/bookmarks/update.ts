'use server';

import { fetchBackend } from '@/lib/actions/fetch-backend';

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
