import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { cn } from '../lib/utils/cn';
import { Toaster } from '../components/ui/toast/toaster';

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
    <html>
      {/* <ThemeProvider> */}
      <body className={cn('min-h-screen antialiased bg-background-page', avenirFont.className)}>
        <div className="container mx-auto px-0 xl:px-4">
          {children}
          <Toaster />
        </div>
      </body>
      {/* </ThemeProvider> */}
    </html>
  );
}
