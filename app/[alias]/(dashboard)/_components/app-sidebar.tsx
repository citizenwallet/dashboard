'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail
} from '@/components/ui/sidebar';
import { CommunityT } from '@/services/top-db/community';
import { UserT } from '@/services/top-db/users';
import { Config } from '@citizenwallet/sdk';
import {
  ArrowLeft,
  Hammer,
  Home,
  Landmark,
  List,
  LucideLineChart,
  Settings,
  Shield,
  University,
  Users
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { CommunitySwitcher } from './community-switcher';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  communities: Config[];
  selectedCommunity: CommunityT;
  user: UserT | null;
}

export function AppSidebar({
  communities,
  selectedCommunity,
  user,
  ...props
}: AppSidebarProps) {

  const data = {
    user: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: user?.avatar ?? ''
    },
    projects: selectedCommunity.active === false ? [
      {
        name: 'Profile',
        url: `/${selectedCommunity.alias}/profile`,
        icon: University
      },
      {
        name: 'Admins',
        url: `/${selectedCommunity.alias}/admins`,
        icon: Shield
      }
    ] : [
      {
        name: 'Overview',
        url: `/${selectedCommunity.alias}`,
        icon: Home
      },
      {
        name: 'Members',
        url: `/${selectedCommunity.alias}/members`,
        icon: Users
      },
      {
        name: 'Transfers',
        url: `/${selectedCommunity.alias}/transfers`,
        icon: LucideLineChart
      },
      {
        name: 'Treasury',
        url: `/${selectedCommunity.alias}/treasury`,
        icon: Landmark,
        items: [
          {
            name: 'History',
            url: `/${selectedCommunity.alias}/treasury`,
            icon: List
          },
          {
            name: 'Minters',
            url: `/${selectedCommunity.alias}/roles`,
            icon: Hammer
          }
        ]
      },
      {
        name: 'Profile',
        url: `/${selectedCommunity.alias}/profile`,
        icon: University
      },
      {
        name: 'Configuration',
        url: `/${selectedCommunity.alias}/configuration`,
        icon: Settings
      },
      {
        name: 'Admins',
        url: `/${selectedCommunity.alias}/admins`,
        icon: Shield
      }
    ]
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BackToAllCommunities />
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

function BackToAllCommunities() {
  const handleClick = () => {
    document.cookie = `lastViewedAlias=; path=/; max-age=0`;
  };

  return (
    <SidebarMenuButton asChild>
      <Link href="/" onClick={handleClick}>
        <ArrowLeft />
        <span>Home</span>
      </Link>
    </SidebarMenuButton>
  );
}
