import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

async function getRedirectUrlFromTXT(
  hostname: string | null
): Promise<string | null> {
  if (!hostname) {
    return null;
  }

  try {
    // Extract the parent domain (citizenwallet.xyz)
    const parentDomain = hostname.includes('.')
      ? hostname.split('.').slice(-2).join('.')
      : hostname;

    // Use DNS-over-HTTPS to resolve TXT records (Edge Runtime compatible)
    const response = await fetch(
      `https://dns.google/resolve?name=${parentDomain}&type=TXT`
    );
    const data = await response.json();

    if (data.Answer) {
      // Look for TXT record with redirect[subdomain]=url format
      for (const answer of data.Answer) {
        if (answer.type === 16) {
          // TXT record type
          const txtData = answer.data.replace(/"/g, ''); // Remove quotes
          const match = txtData.match(/^redirect\[([^\]]+)\]=(.+)$/);
          if (match) {
            const [_, configuredHostname, redirectUrl] = match;
            if (configuredHostname === hostname) {
              return redirectUrl.trim();
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error resolving TXT record:', error);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');

  // Check for redirect configuration for any subdomain
  const redirectUrl = await getRedirectUrlFromTXT(hostname);
  if (redirectUrl) {
    return NextResponse.redirect(redirectUrl);
  }

  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users from /login to /
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Continue with the request if no cookie is found or not on the home page
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
