'use server';

import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/actions/fetch-backend';
import { USER_ROOT_CATEGORY_ID_COOKIE_NAME } from '../../../constants';

export async function createBookmark(data: {
  title: string;
  link: string;
  categoryId?: number;
  description?: string;
}) {
  if (!data.categoryId) {
    data.categoryId = parseInt(cookies().get(USER_ROOT_CATEGORY_ID_COOKIE_NAME)!.value);
  }

  return fetchBackend('POST', '/bookmarks', data);
}
