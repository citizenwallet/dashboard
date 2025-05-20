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
import { StorageKeys, StorageService } from '@/services/storage';
import { Config } from '@citizenwallet/sdk';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { SessionLogic } from 'state/session/action';
import { useSessionStore } from 'state/session/state';

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
  const { data: session, update } = useSession();
  const router = useRouter();

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
                <AvatarImage src={user.avatar} alt={user.name} />
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
                  <AvatarImage src={user.avatar} alt={user.name} />
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
              <form
                action={async () => {
                  try {
                    if (config) {

                      // clear state
                      const data = useSessionStore.getState();
                      const sessionLogic = new SessionLogic(data, config);
                      sessionLogic.clear();

                      // clear localstorage
                      const alias = config.community.alias
                      const storage = new StorageService(alias);
                      storage.deleteKey(StorageKeys.session_private_key);
                      storage.deleteKey(StorageKeys.session_hash);
                      storage.deleteKey(StorageKeys.session_source_value);
                      storage.deleteKey(StorageKeys.session_source_type);

                      const removeChainIds = config?.community.profile.chain_id;
                      const updateChainIds = session?.user.chainIds?.filter((chainId: number) => chainId !== removeChainIds);

                      //remove chainId from session
                      await update({
                        chainIds: updateChainIds
                      });

                    }
                  } catch (error) {
                    console.error(error);
                  } finally {
                    router.push('/');
                  }


                }}
              >
                <button className="flex items-center gap-2" type="submit">
                  <LogOut className="" />
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
