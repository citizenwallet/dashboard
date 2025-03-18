import User from './user';
import UrlSearch from '@/components/custom/url-search';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAdminByEmailAction } from '@/app/_actions/admin-actions';
import { cookies } from 'next/headers';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const lastViewedAlias = await (await cookies()).get('lastViewedAlias')?.value;

  if (!session?.user) {
    redirect('/login');
  }

  if (lastViewedAlias) {
    redirect(`/${lastViewedAlias}`);
  }

  const admin = await getAdminByEmailAction({
    email: session.user.email ?? '',
    chainId: 42220
  });

  const accessList = admin?.admin_community_access.map((access) => access.alias) ?? [];

  if (accessList.length !== 0) {
    const firstCommunity = accessList[0];
    redirect(`/${firstCommunity}`);
  }

  return (
    <main className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <UrlSearch />
          <User session={session} admin={admin} />
        </header>
        <main className="flex flex-col items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40 overflow-hidden">
          {children}
        </main>
      </div>
    </main>
  );
}
