import { auth } from '@/auth';
import UrlSearch from '@/components/custom/url-search';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { getUserByEmail } from '@/services/top-db/users';
import { CommunityConfig, getAccountBalance } from '@citizenwallet/sdk';
import { formatUnits } from 'ethers';
import Topsidebar from './_components/Top-sidebar';


export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {


  const session = await auth();
  let role = null;
  let account = null;
  let balance = null;

  if (session) {
    const client = getServiceRoleClient();
    const { email } = session.user;
    const { data } = await getUserByEmail({ client, email: email ?? '' });

    const { data: ctzn_data, error: ctzn_error } = await getCommunityByAlias(client, 'ctzn');

    if (ctzn_error || !ctzn_data) {
      throw new Error('Failed to get CTZN community by alias');
    }

    role = data?.role;
    account = session.user.address;

    const ctzn_config = ctzn_data.json;
    const ctzn_communityConfig = new CommunityConfig(ctzn_config);
    const balanceNotFormatted = await getAccountBalance(
      ctzn_communityConfig,
      session?.user?.address ?? ''
    );

    balance = balanceNotFormatted ? Number(formatUnits(balanceNotFormatted, ctzn_communityConfig.getToken().decimals)) : 0;
  }


  return (
    <SidebarProvider>
      {role === 'admin' && <Topsidebar account={account ?? ''} balance={balance ?? 0} />}
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mb-4">
          {role === 'admin' && (
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          )}
          <div className="flex items-center gap-2 w-full p-4">
            <UrlSearch />
          </div>
        </header>
        <main className="flex flex-col items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
