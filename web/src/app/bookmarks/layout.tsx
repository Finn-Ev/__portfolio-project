'use server';

import MainNav from '../../components/mainNav';

export default async function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="container flex mx-auto px-0 xl:px-4">
        <MainNav />
        <div className="w-full p-4">{children}</div>
      </div>
    </main>
  );
}
