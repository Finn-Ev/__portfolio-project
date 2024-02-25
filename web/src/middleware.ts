import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USER_TOKEN_COOKIE_NAME } from '@/constants';

export async function middleware(request: NextRequest) {
  const userToken = cookies().get(USER_TOKEN_COOKIE_NAME)?.value;

  if (request.nextUrl.pathname === '/' && !userToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (request.nextUrl.pathname === '/' && userToken) {
    return NextResponse.redirect(new URL('/bookmarks', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/auth') && userToken) {
    return NextResponse.redirect(new URL('/bookmarks', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/bookmarks') && !userToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}
