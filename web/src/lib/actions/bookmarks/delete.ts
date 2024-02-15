'use server';

import { fetchBackend } from '../fetchBackend';

export async function deleteBookmark(bookmarkId: number) {
  return fetchBackend('DELETE', `/bookmarks/${bookmarkId}`);
}
