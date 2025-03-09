'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Config, CommunityConfig, ConfigToken } from '@citizenwallet/sdk';
import { CommunityLogo } from '@/components/icons';
import { useRouter } from 'next/navigation';

export function CommunitySwitcher({
  communities,
  selectedCommunity
}: {
  communities: Config[];
  selectedCommunity?: Config;
}) {
  const { isMobile } = useSidebar();
  const [activeCommunity, setActiveCommunity] =
    React.useState(selectedCommunity);
  const router = useRouter();

  if (!activeCommunity) {
    return null;
  }

  const communityConfig = new CommunityConfig(activeCommunity);
  const primaryToken: ConfigToken = communityConfig.primaryToken;
  const logo: string = communityConfig.community.logo;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <CommunityLogo
                  logoUrl={logo}
                  tokenSymbol={primaryToken.symbol}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeCommunity.community.name}
                </span>
                <span className="truncate text-xs">
                  {activeCommunity.community.alias}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Communities
            </DropdownMenuLabel>
            {communities.map((community, index) => {
              const communityConfig = new CommunityConfig(community);
              const primaryToken = communityConfig.primaryToken;
              const logo = communityConfig.community.logo;

              const onSelectCommunity = () => {
                setActiveCommunity(community);
                router.push(`/${community.community.alias}`);
              };

              return (
                <DropdownMenuItem
                  key={community.community.alias}
                  onClick={onSelectCommunity}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <CommunityLogo
                      logoUrl={logo}
                      tokenSymbol={primaryToken.symbol}
                    />
                  </div>
                  {community.community.name}
                  {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              );
            })}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
