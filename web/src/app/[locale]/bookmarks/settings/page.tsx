import LogoutBtn from '@/components/logout-btn';
import { getCurrentUser } from '@/lib/actions/auth';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export default async function Page() {
  const t = await getTranslations();
  const user = await getCurrentUser();

  return (
    <div className="settings-page p-4 flex flex-col items-center justify-center h-full gap-4">
      {user?.email ? (
        <div className="text-center">
          {t('Auth.loggedInAsText')}:
          <br />
          {user!.email}
        </div>
      ) : (
        <div>{t('Miscellaneous.ErrorMessages.clientCookies')}</div>
      )}
      <LogoutBtn className="max-w-64" />
    </div>
  );
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: t('Miscellaneous.PageTabTitles.settings'),
  };
}
