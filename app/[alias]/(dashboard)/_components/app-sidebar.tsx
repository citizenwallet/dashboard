'use client';

import type * as React from 'react';
import {
  Home,
  Users,
  LucideLineChart,
  Shield,
  Landmark,
  ArrowLeft,
  UserCog
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
import { UserT } from '@/services/top-db/users';
import Link from 'next/link';
import { SidebarMenuButton } from '@/components/ui/sidebar';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  communities: Config[];
  selectedAlias: string;
  user: UserT | null;
}

export function AppSidebar({
  communities,
  selectedAlias,
  user,
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
      ,
      {
        name: 'Roles',
        url: `/${selectedCommunity?.community.alias}/roles`,
        icon: UserCog
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
