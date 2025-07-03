'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { StorageService } from '@/services/storage';
import { CommunityConfig, Config, revokeSession } from '@citizenwallet/sdk';
import { Wallet } from 'ethers';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useSession as useNextAuthSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'state/session/action';

export function NavUser({
  user,
  config
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  config?: Config;
}) {
  const { isMobile } = useSidebar();
  const { data: session, update } = useNextAuthSession();
  const router = useRouter();

  const [, sessionActions] = useSession(config as Config);

  const removeSession = async () => {
    try {
      if (!config) {
        return;
      }

      const privateKey = sessionActions.storage.getKey('session_private_key');
      const account = await sessionActions.getAccountAddress();
      const communityConfig = new CommunityConfig(config);
      const storageService = new StorageService(config.community.alias);

      if (!privateKey || !account) {
        return;
      }

      const signer = new Wallet(privateKey);

      const tx = await revokeSession({
        community: communityConfig,
        signer,
        account
      });

      if (!tx) {
        toast.error('Signout failed');
        return;
      }
      sessionActions.clear();
      storageService.deleteKey('session_private_key');
      storageService.deleteKey('session_source_type');
      storageService.deleteKey('session_source_value');
      storageService.deleteKey('session_hash');

      const removeChainIds = config?.community.profile.chain_id;
      const updateChainIds = session?.user.chainIds?.filter(
        (chainId: number) => chainId !== removeChainIds
      );

      //remove chainId from session
      await update({
        chainIds: updateChainIds
      });

      toast.success('Signout successful');
    } catch (error) {
      console.error(error);
      toast.error('Signout failed');
    } finally {
      router.push('/');
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="flex items-center gap-2"
                onClick={removeSession}
              >
                <LogOut className="" />
                Sign Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
