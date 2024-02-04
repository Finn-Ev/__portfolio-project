'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/actions/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const userData = await getCurrentUser();

      if (userData) {
        router.push('/bookmarks');
        return;
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return <main className="m-4">{children}</main>;
}
