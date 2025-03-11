'use client';

import type * as React from 'react';
import {
  Home,
  Users,
  LucideLineChart
} from 'lucide-react';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { CommunitySwitcher } from './community-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import { Config } from '@citizenwallet/sdk';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  communities: Config[];
  selectedAlias: string;
}

export function AppSidebar({
  communities,
  selectedAlias,
  ...props
}: AppSidebarProps) {
  const selectedCommunity = communities.find(
    (community) => community.community.alias === selectedAlias
  );

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg'
    },
    projects: [
      {
        name: 'Home',
        url: `/${selectedCommunity?.community.alias}`,
        icon: Home
      },
      {
        name: 'Members',
        url: `/${selectedCommunity?.community.alias}/members`,
        icon: Users
      },
      {
        name: 'Transfers',
        url: `/${selectedCommunity?.community.alias}/transfers`,
        icon: LucideLineChart
      }
    ]
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CommunitySwitcher
          communities={communities}
          selectedCommunity={selectedCommunity}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
