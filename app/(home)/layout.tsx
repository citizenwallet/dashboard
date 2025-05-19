import UrlSearch from '@/components/custom/url-search';

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
