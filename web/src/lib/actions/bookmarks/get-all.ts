import { Bookmark } from '@/lib/types';
import { fetchBackend } from '@/lib/actions/fetch-backend';

export async function getAllBookmarks() {
  return fetchBackend<Bookmark[]>('GET', '/bookmarks');
}
