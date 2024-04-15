'use server';

import { fetchBackend } from '@/lib/actions/fetch-backend';
import { getCurrentUser } from '@/lib/actions/auth';

export async function createBookmark(data: {
  title: string;
  link: string;
  categoryId?: number;
  description?: string;
}) {
  if (!data.categoryId) {
    const user = await getCurrentUser();

    if (user) {
      data.categoryId = user.rootCategoryId;
    }
  }

  return fetchBackend('POST', '/bookmarks', data);
}
