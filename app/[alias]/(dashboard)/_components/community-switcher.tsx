'use client';

import { CommunityLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
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
import { CommunityConfig, Config, ConfigToken } from '@citizenwallet/sdk';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CommunitySwitcher({
  communities,
  selectedCommunity,
  active
}: {
  communities: Config[];
  selectedCommunity?: Config;
  active?: boolean;
}) {
  const { isMobile } = useSidebar();
  const [activeCommunity, setActiveCommunity] = useState(selectedCommunity);
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
                  tokenSymbol={primaryToken?.symbol || "ETH"}
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
              {active ? (
                <Badge variant="default" className="bg-green-500">
                  Public
                </Badge>
              ) : (
                <Badge className="bg-gray-500">Inactive</Badge>
              )}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>

          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg max-h-[300px] overflow-y-auto"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Communities
            </DropdownMenuLabel>
            {communities.map((community) => {
              const communityConfig = new CommunityConfig(community);
              const alias = communityConfig.community.alias;
              const primaryToken = communityConfig.primaryToken;
              const logo = communityConfig.community.logo;

              const onSelectCommunity = () => {
                document.cookie = `lastViewedAlias=${alias}; path=/; max-age=31536000`;
                setActiveCommunity(community);
                router.push(`/${alias}`);
              };

              return (
                <DropdownMenuItem
                  key={community.community.alias}
                  onClick={onSelectCommunity}
                  className="gap-4 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <CommunityLogo
                      logoUrl={logo}
                      tokenSymbol={primaryToken.symbol}
                    />
                  </div>
                  {community.community.name}
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
