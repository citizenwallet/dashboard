import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from './_components/app-sidebar';
import { fetchCommunitiesOfChainAction } from '@/app/_actions/community-actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAdminByEmailAction } from '@/app/_actions/admin-actions';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ alias: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const admin = await getAdminByEmailAction({
    email: session.user.email ?? '',
    chainId: 42220
  });

  const { alias } = await params;

  if (!admin?.community_access_list.includes(alias)) {
    redirect('/');
  }

  const { communities } = await fetchCommunitiesOfChainAction({
    chainId: 42220,
    accessList: admin.community_access_list
  });

  return (
    <SidebarProvider>
      <AppSidebar
        admin={admin}
        communities={communities}
        selectedAlias={alias}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
