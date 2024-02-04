import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/bookmarks', request.url).toString());
}

export const config = {
  matcher: '/',
};
