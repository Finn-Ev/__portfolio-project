import { Bookmark } from '@/lib/types';
import { fetchBackend } from '@/lib/actions/fetchBackend';

export async function getAllFavourites() {
  return fetchBackend<Bookmark[]>('GET', '/favourites');
}
