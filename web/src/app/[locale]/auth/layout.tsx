'use server';

import LanguageSelect from '@/components/language-select';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';
import { redirect } from '@/navigation';
import { cookies } from 'next/headers';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (cookies().get(USER_TOKEN_COOKIE_NAME)?.value) {
    redirect('/bookmarks');
  }

  return (
    <main className="flex justify-center">
      <div className="flex flex-col items-center p-8 rounded-lg bg-background m-4">
        <div>{children}</div>
        <LanguageSelect className="mt-3" />
      </div>
    </main>
  );
}
