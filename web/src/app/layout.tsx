import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

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
    <html lang="en">
      <body className={avenirFont.className}>{children}</body>
    </html>
  );
}
