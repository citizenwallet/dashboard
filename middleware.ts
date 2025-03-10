import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  const lastViewedAlias = request.cookies.get('lastViewedAlias')?.value;
  if (request.nextUrl.pathname === '/' && lastViewedAlias) {
    return NextResponse.redirect(new URL(`/${lastViewedAlias}`, request.url));
  }

  // Continue with the request if no cookie is found or not on the home page
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
