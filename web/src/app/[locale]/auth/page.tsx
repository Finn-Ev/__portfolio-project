import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('Auth');

  return (
    <>
      <div className="text-center mb-2">
        <div className="font-bold text-2xl">{t('welcomeText')}</div>
        <div className="text-lg">{t('welcomeInstruction')}</div>
      </div>
      <div className="mt-4 flex gap-2 flex-col items-center md:flex-row">
        <Link href={'/auth/login'}>
          <Button>{t('loginTitle')}</Button>
        </Link>
        <Link href={'/auth/register'}>
          <Button>{t('registerTitle')}</Button>
        </Link>
      </div>
    </>
  );
}
