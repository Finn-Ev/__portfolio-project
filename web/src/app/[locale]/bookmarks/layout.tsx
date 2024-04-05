'use server';

import MainNav from '@/components/main-nav';
import { cookies } from 'next/headers';
import { redirect } from '@/lib/navigation';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';

export default async function BookmarksLayout({ children }: { children: React.ReactNode }) {
  if (!cookies().get(USER_TOKEN_COOKIE_NAME)?.value) {
    redirect('/auth');
  }

  return (
    <main>
      <div className="relative container flex mx-auto px-0 xl:px-4">
        <MainNav />
        <div className="w-full p-4">{children}</div>
      </div>
    </main>
  );
}
