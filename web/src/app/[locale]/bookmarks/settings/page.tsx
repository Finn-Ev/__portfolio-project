import LogoutBtn from '@/components/logout-btn';
import { getCurrentUser } from '@/lib/actions/auth';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export default async function Page() {
  const t = await getTranslations('Auth');
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="settings-page p-4 flex flex-col gap-4">
      {t('loggedInAsText')} {user!.email}
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
    title: t('Miscellaneous.pageTabTitles.settings'),
  };
}
