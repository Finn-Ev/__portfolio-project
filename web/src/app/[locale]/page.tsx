import { redirect } from '@/lib/navigation';
import { cookies } from 'next/headers';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';

export default function Index() {
  if (cookies().get(USER_TOKEN_COOKIE_NAME)?.value) {
    redirect('/bookmarks');
  } else {
    redirect('/auth');
  }

  return null;
}
