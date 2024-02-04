'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/actions/auth';
import MainNav from '../../components/MainNav';

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const userData = await getCurrentUser();

      if (!userData) {
        router.push('/auth');
        return;
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <main>
      <div className="container flex mx-auto px-0 xl:px-4">
        <MainNav />
        <div>{children}</div>
      </div>
    </main>
  );
}
