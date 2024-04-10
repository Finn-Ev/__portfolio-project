import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const t = useTranslations('');
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>{t('Miscellaneous.pageNotFound.pageTitle')}</h1>
      <Link href="/" className="ml-2">
        <Button className="mt-4">{t('Miscellaneous.pageNotFound.linkText')}</Button>
      </Link>
    </div>
  );
}
