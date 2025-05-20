'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserT } from '@/services/top-db/users';
import { Config } from '@citizenwallet/sdk';
import {
  ArrowLeft,
  Hammer,
  Home,
  Landmark,
  List,
  LucideLineChart,
  Shield,
  Users
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { CommunitySwitcher } from './community-switcher';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  communities: Config[];
  selectedAlias: string;
  user: UserT | null;
  hasAccess: boolean;
}

export function AppSidebar({
  communities,
  selectedAlias,
  user,
  hasAccess,
  ...props
}: AppSidebarProps) {
  const selectedCommunity = communities.find(
    (community) => community.community.alias === selectedAlias
  );


  const data = {
    user: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: user?.avatar ?? ''
    },
    projects: [
      {
        name: 'Overview',
        url: `/${selectedCommunity?.community.alias}`,
        icon: Home
      },
      {
        name: 'Members',
        url: `/${selectedCommunity?.community.alias}/members`,
        icon: Users
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
      {
        name: 'Treasury',
        url: `/${selectedCommunity?.community.alias}/treasury`,
        icon: Landmark,
        items: [
          {
            name: 'History',
            url: `/${selectedCommunity?.community.alias}/treasury`,
            icon: List
          },
          {
            name: 'Minters',
            url: `/${selectedCommunity?.community.alias}/roles`,
            icon: Hammer
          }
        ]
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
        <BackToAllCommunities />
        <CommunitySwitcher
          communities={communities}
          selectedCommunity={selectedCommunity}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={
          hasAccess ? data.projects : data.projects.filter(project => project.name == 'Overview')
        } />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} config={selectedCommunity} />
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
