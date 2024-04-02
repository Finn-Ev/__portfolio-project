'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface LogoutBtnProps {
  className?: string;
}

export default function LogoutBtn({ className }: LogoutBtnProps) {
  const t = useTranslations('Auth');
  const router = useRouter();

  async function handleLogout() {
    await logout();

    router.push('/auth');
  }

  return (
    <Button className={className} onClick={handleLogout}>
      {t('logoutButtonLabel')}
    </Button>
  );
}
