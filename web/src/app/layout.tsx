import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import NavBar from '../components/MainNav';
import { cn } from '../lib/utils';
import { Toaster } from '../components/ui/toast/Toaster';

import { ThemeProvider } from '../providers';

const avenirFont = localFont({
  src: [
    {
      path: '../../public/Avenir Book.ttf',
      weight: '400',
    },
    {
      path: '../../public/Avenir Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/Avenir Heavy.ttf',
      weight: '700',
    },
  ],
});

export const metadata: Metadata = {
  title: 'Bookmark App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <ThemeProvider>
        <body className={cn('min-h-screen antialiased dark:bg-zinc-800', avenirFont.className)}>
          <div className="container flex mx-auto px-4 ">
            <NavBar />
            <div>{children}</div>
            <Toaster />
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
