'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

export function NavProjects({
  projects
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    items?: {
      name: string;
      url: string;
      icon: LucideIcon;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>

        {projects.map((item) => (
          <Collapsible
            key={item.name}
            asChild
            className="group/collapsible"
          >

            {item.items && item.items.length > 0 ? (

              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.name}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.name}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <subItem.icon />
                            <span>{subItem.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>

            ) : (

              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            )}

          </Collapsible>
        ))}


      </SidebarMenu>
    </SidebarGroup>
  );
}
