import { fetchCommunitiesAction } from '@/app/_actions/community-actions';
import { getAuthUserAction } from '@/app/_actions/user-actions';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { redirect } from 'next/navigation';
import { AppSidebar } from './_components/app-sidebar';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;

  const user = await getAuthUserAction();

  if (!user) {
    redirect('/login');
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

  const { communities } = await fetchCommunitiesAction({});
  const client = getServiceRoleClient();
  const { data: selectedCommunity } = await getCommunityByAlias(client, alias);

  if (!selectedCommunity) {
    redirect('/');
  }


  return (
    <SidebarProvider>
      <AppSidebar user={user} communities={communities} selectedCommunity={selectedCommunity} />
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
