'use server';

import LanguageSelect from '@/components/language-select';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';
import { redirect } from '@/lib/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import ThemeToggle from '@/components/theme-toggle';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (cookies().get(USER_TOKEN_COOKIE_NAME)?.value) {
    redirect('/bookmarks');
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-background m-4">
        <div>{children}</div>
        <div className="flex gap-2">
          <LanguageSelect className="mt-3" />
          <ThemeToggle className="mt-3" />
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: t('Miscellaneous.pageTabTitles.welcome'),
  };
}
