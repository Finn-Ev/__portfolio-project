'use server';

import { fetchBackend } from '../fetch-backend';

export async function deleteBookmark(bookmarkId: number) {
  return fetchBackend('DELETE', `/bookmarks/${bookmarkId}`);
}
