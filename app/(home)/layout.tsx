import User from './user';
import UrlSearch from '@/components/custom/url-search';
import { redirect } from 'next/navigation';
import { getAuthUserAction } from '@/app/(home)/_actions/user-actions';
import { cookies } from 'next/headers';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const lastViewedAlias = (await cookies()).get('lastViewedAlias')?.value;
  const user = await getAuthUserAction();

  if (!user) {
    redirect('/login');
  }

  const { role } = user;
  const accessList =
    user?.users_community_access.map((access) => access.alias) ?? [];

  if (
    role === 'user' &&
    lastViewedAlias &&
    accessList.includes(lastViewedAlias)
  ) {
    redirect(`/${lastViewedAlias}`);
  }

  if (role === 'user' && !lastViewedAlias && accessList.length > 0) {
    redirect(`/${accessList[0]}`);
  }

  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <UrlSearch />
          <User user={user} />
        </header>
        <main className="flex-1 overflow-hidden p-4 sm:px-6">{children}</main>
      </div>
    </main>
  );
}
