'use server';

import { Bookmark } from '@/lib/types';
import { fetchBackend } from '@/lib/actions/fetchBackend';

export async function setFavourite(bookmarkId: number, newValue: boolean) {
  return fetchBackend<Bookmark>('PATCH', `/favourites/${bookmarkId}/${newValue}`);
}
