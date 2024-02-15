import { Bookmark } from '@/lib/types';
import { fetchBackend } from '@/lib/actions/fetchBackend';

export async function getAllBookmarks() {
  return fetchBackend<Bookmark[]>('GET', '/bookmarks');
}
