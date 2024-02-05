'use client';

import { Button } from './ui/button';
import { logoutUser } from '../lib/actions/auth';
import { useRouter } from 'next/navigation';

export default function LogoutBtn() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();

    router.push('/auth');
  }

  return <Button onClick={handleLogout}>Logout</Button>;
}
