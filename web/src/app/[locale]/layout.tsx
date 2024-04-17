import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { cn } from '@/lib/utils/cn';
import { Toaster } from '@/components/ui/toast/toaster';

import { getTranslations } from 'next-intl/server';
import { ThemeProvider } from '@/providers';
import { NextIntlClientProvider, useMessages } from 'next-intl';

const avenirFont = localFont({
  src: [
    {
      path: '../../../public/Avenir Book.ttf',
      weight: '400',
    },
    {
      path: '../../../public/Avenir Medium.ttf',
      weight: '500',
    },
    {
      path: '../../../public/Avenir Heavy.ttf',
      weight: '700',
    },
  ],
});

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();
  return (
    <html lang={params.locale}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
      </head>
      {/* <ThemeProvider> */}
      <NextIntlClientProvider locale={params.locale} messages={messages}>
        <body
          className={cn(
            'min-h-full h-auto antialiased bg-background-page overflow-x-hidden',
            avenirFont.className,
          )}
        >
          <div className=" mx-auto px-0 xl:px-4">
            {children}
            <Toaster />
          </div>
        </body>
      </NextIntlClientProvider>
      {/* </ThemeProvider> */}
    </html>
  );
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: {
      default: t('Miscellaneous.pageTabTitles.default'),
      template: `%s | ${t('Miscellaneous.pageTabTitles.default')}`,
    },
  };
}
