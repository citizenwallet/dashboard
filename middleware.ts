// Don't invoke Middleware on some paths
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

export function middleware() {
  // Do nothing, just pass through
}
