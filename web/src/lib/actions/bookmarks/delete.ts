'use server';

import { fetchBackend } from '@/lib/actions/fetch-backend';

export async function deleteBookmark(bookmarkId: number) {
  return fetchBackend('DELETE', `/bookmarks/${bookmarkId}`);
}
