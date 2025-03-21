import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

export const metadata = {
  title: 'Citizen Wallet',
  description:
    'An admin dashboard for you community'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <SessionProvider session={session}>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
      <Analytics />
    </html>
  );
}
