import User from './user';
import UrlSearch from '@/components/custom/url-search';
import { redirect } from 'next/navigation';
import { getAuthUserAction } from '@/app/_actions/user-actions';
import { cookies } from 'next/headers';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <UrlSearch />
        </header>
        <main className="flex-1 overflow-hidden p-4 sm:px-6">{children}</main>
      </div>
    </main>
  );
}
