import { Bookmark } from '@/lib/types';
import { fetchBackend } from '@/lib/actions/fetch-backend';

export async function getAllFavourites() {
  return fetchBackend<Bookmark[]>('GET', '/favourites');
}
