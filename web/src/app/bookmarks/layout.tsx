'use server';

import MainNav from '../../components/MainNav';

export default async function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="container flex mx-auto px-0 xl:px-4">
        <MainNav />
        <div>{children}</div>
      </div>
    </main>
  );
}
