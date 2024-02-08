'use client';

import React, { HTMLAttributes } from 'react';
import { Button } from './ui/button';
import { logout } from '../lib/actions/auth';
import { useRouter } from 'next/navigation';

interface LogoutBtnProps {
  className?: string;
}

export default function LogoutBtn({ className }: LogoutBtnProps) {
  const router = useRouter();

  async function handleLogout() {
    await logout();

    router.push('/auth');
  }

  return (
    <Button className={className} onClick={handleLogout}>
      Logout
    </Button>
  );
}
