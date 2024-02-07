'use client';

import { Button } from './ui/button';
import { logout } from '../lib/actions/auth';
import { useRouter } from 'next/navigation';

export default function LogoutBtn() {
  const router = useRouter();

  async function handleLogout() {
    await logout();

    router.push('/auth');
  }

  return <Button onClick={handleLogout}>Logout</Button>;
}
