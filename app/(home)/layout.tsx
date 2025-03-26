import User from './user';
import UrlSearch from '@/components/custom/url-search';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserByEmailAction } from '@/app/(home)/_actions/user-actions';
import { cookies } from 'next/headers';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const lastViewedAlias = (await cookies()).get('lastViewedAlias')?.value;

  if (!session?.user) {
    redirect('/login');
  }

  const user = await getUserByEmailAction({
    email: session.user.email ?? ''
  });

  const accessList =
    user?.users_community_access.map((access) => access.alias) ?? [];

  if (lastViewedAlias && accessList.includes(lastViewedAlias)) {
    redirect(`/${lastViewedAlias}`);
  }

  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <UrlSearch />
          <User session={session} user={user} />
        </header>
        <main className="flex flex-col items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 overflow-hidden">
          {children}
        </main>
      </div>
    </main>
  );
}
