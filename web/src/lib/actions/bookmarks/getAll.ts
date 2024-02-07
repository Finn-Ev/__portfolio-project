import { Bookmark } from '../../types';
import { fetchBackend } from '../fetchBackend';

export async function getAllBookmarks(): Promise<{
  value?: Bookmark[];
  error?: Error;
}> {
  return fetchBackend<Bookmark[]>('GET', '/bookmarks');
}
