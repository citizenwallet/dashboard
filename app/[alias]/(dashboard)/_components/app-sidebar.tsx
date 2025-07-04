'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail
} from '@/components/ui/sidebar';
import { isEmpty } from '@/lib/utils';
import { UserRow } from '@/services/top-db/users';
import { Config } from '@citizenwallet/sdk';
import {
  ArrowLeft,
  CircleCheck,
  CircleDashed,
  Hammer,
  Home,
  Landmark,
  List,
  LucideLineChart,
  PlusIcon,
  Settings,
  Shield,
  University,
  Users,
  Webhook,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { CommunitySwitcher } from './community-switcher';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  communities: Config[];
  config: Config;
  active: boolean;
  user: UserRow | null;
  hasAccess: boolean;
}

export function AppSidebar({
  communities,
  config,
  active,
  user,
  hasAccess,
  ...props
}: AppSidebarProps) {
  const profileActive =
    !isEmpty(config.community.logo) && !isEmpty(config.community.url);
  const currencyActive =
    !isEmpty(config.community.primary_token.address) &&
    !isEmpty(config.community.profile.address);

  const data = {
    user: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: user?.avatar ?? ''
    },
    projects:
      active === false
        ? [
            {
              name: 'Profile',
              url: `/${config?.community.alias}/profile`,
              icon: University,
              nextIcon: profileActive ? CircleCheck : CircleDashed
            },
            {
              name: 'Currency',
              url: `/${config?.community.alias}/configuration`,
              icon: Settings,
              nextIcon: currencyActive ? CircleCheck : CircleDashed
            },
            {
              name: 'Admins',
              url: `/${config?.community.alias}/admins`,
              icon: Shield
            }
          ]
        : [
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
              name: 'Profile',
              url: `/${config?.community.alias}/profile`,
              icon: University
            },
            {
              name: 'Currency',
              url: `/${config?.community.alias}/configuration`,
              icon: Settings
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
          active={active}
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
        <div className="flex justify-between items-center text-md px-2 py-2 gap-2 bg-sidebar-accent rounded-lg">
          <Image
            src="https://assets.citizenwallet.xyz/wallet-config/_images/ctzn.svg"
            alt="CTZN"
            width={28}
            height={28}
          />
          <p className="flex-1 px-4 py-2">0</p>
          <Button variant="default" size="sm">
            <PlusIcon />
          </Button>
        </div>
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
