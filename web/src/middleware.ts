import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';

import createMiddleware from 'next-intl/middleware';

// export async function middleware(request: NextRequest) {
//   const userToken = cookies().get(USER_TOKEN_COOKIE_NAME)?.value;

//   if (request.nextUrl.pathname === '/' && !userToken) {
//     return NextResponse.redirect(new URL('/auth', request.url));
//   }

//   if (request.nextUrl.pathname === '/' && userToken) {
//     return NextResponse.redirect(new URL('/bookmarks', request.url));
//   }

//   if (request.nextUrl.pathname.startsWith('/auth') && userToken) {
//     return NextResponse.redirect(new URL('/bookmarks', request.url));
//   }

//   if (request.nextUrl.pathname.startsWith('/bookmarks') && !userToken) {
//     return NextResponse.redirect(new URL('/auth', request.url));
//   }
// }

export default createMiddleware({
  locales: ['en', 'de'],
  defaultLocale: 'de',
  localePrefix: 'never',
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/bookmarks/(.+)',
  ],
};
