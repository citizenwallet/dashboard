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
  Users,
  Webhook,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { CommunitySwitcher } from './community-switcher';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  communities: Config[];
  config: Config;
  user: UserT | null;
  hasAccess: boolean;
}

export function AppSidebar({
  communities,
  config,
  user,
  hasAccess,
  ...props
}: AppSidebarProps) {
  const data = {
    user: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: user?.avatar ?? ''
    },
    projects: [
      {
        name: 'Overview',
        url: `/${config?.community.alias}`,
        icon: Home
      },
      {
        name: 'Members',
        url: `/${config?.community.alias}/members`,
        icon: Users
      },
      {
        name: 'Members',
        url: `/${config?.community.alias}/members`,
        icon: Users
      },
      {
        name: 'Transfers',
        url: `/${config?.community.alias}/transfers`,
        icon: LucideLineChart
      },
      {
        name: 'Treasury',
        url: `/${config?.community.alias}/treasury`,
        icon: Landmark,
        items: [
          {
            name: 'History',
            url: `/${config?.community.alias}/treasury`,
            icon: List
          },
          {
            name: 'Minters',
            url: `/${config?.community.alias}/roles`,
            icon: Hammer
          }
        ]
      },
      {
        name: 'Admins',
        url: `/${config?.community.alias}/admins`,
        icon: Shield
      },
      {
        name: 'Developer',
        url: `/${config?.community.alias}`,
        icon: Wrench,
        items: [
          {
            name: 'Webhooks',
            url: `/${config?.community.alias}/webhooks`,
            icon: Webhook
          }
        ]
      }
    ]
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BackToAllCommunities />
        <CommunitySwitcher
          communities={communities}
          selectedCommunity={config}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects
          projects={
            hasAccess
              ? data.projects
              : data.projects.filter((project) => project.name == 'Overview')
          }
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} config={config} />
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
