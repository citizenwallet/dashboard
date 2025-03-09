import User from './user';
import UrlSearch from '@/components/custom/url-search';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
  }) {
  return (
    <main className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <UrlSearch />
          <User />
        </header>
        <main className="flex flex-col items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40 overflow-hidden">
          {children}
        </main>
      </div>
    </main>
  );
}
