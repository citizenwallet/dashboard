'use client';

import type * as React from 'react';
import { Home, Users, LucideLineChart, Shield, Landmark } from 'lucide-react';
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
import { AdminT } from '@/services/db/admin';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  communities: Config[];
  selectedAlias: string;
  admin: AdminT | null;
}

export function AppSidebar({
  communities,
  selectedAlias,
  admin,
  ...props
}: AppSidebarProps) {
  const selectedCommunity = communities.find(
    (community) => community.community.alias === selectedAlias
  );

  const data = {
    user: {
      name: admin?.name ?? '',
      email: admin?.email ?? '',
      avatar: admin?.avatar ?? ''
    },
    // TODO: add treasury
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
      },
      // {
      //   name: 'Marketplace',
      //   url: `/${selectedCommunity?.community.alias}/marketplace`,
      //   icon: HandHeartIcon
      // },
      {
        name: 'Treasury',
        url: `/${selectedCommunity?.community.alias}/treasury`,
        icon: Landmark
      },
      {
        name: 'Admins',
        url: `/${selectedCommunity?.community.alias}/admins`,
        icon: Shield
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
