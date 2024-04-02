import LogoutBtn from '@/components/logout-btn';
import { getCurrentUser } from '@/lib/actions/auth';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Auth');
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className=" p-4 flex flex-col gap-4">
      {t('loggedInAsText')} {user!.email}
      <LogoutBtn className="max-w-64" />
    </div>
  );
}
