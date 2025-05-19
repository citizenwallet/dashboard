import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from './_components/app-sidebar';
import { fetchCommunitiesAction } from '@/app/_actions/community-actions';
import { redirect } from 'next/navigation';
import { getAuthUserAction } from '@/app/_actions/user-actions';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;

  const user = await getAuthUserAction({ alias });

  if (!user) {
    redirect(`/${alias}/login`);
  }

  const { role } = user;
  const accessList =
    user?.users_community_access.map((access) => access.alias) ?? [];

  if (role === 'user' && accessList.length < 1) {
    redirect('/');
  }

  if (role === 'user' && accessList.length > 0 && !accessList.includes(alias)) {
    const alias = accessList[0];
    redirect(`/${alias}`);
  }

  const { communities } = await fetchCommunitiesAction({ alias });

  return (
    <SidebarProvider>
      <AppSidebar user={user} communities={communities} selectedAlias={alias} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="flex flex-col items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
