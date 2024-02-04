import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const userToken = cookies().get('user_token')?.value;

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