'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from '@/components/ui/sidebar';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function Topsidebar({
    account,
    balance
}: {
    account: string;
    balance: number;
}) {

    const pathname = usePathname();

    const sidebar = [{
        name: 'Communities',
        url: `/`,
        icon: Home
    }];
    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu className='mt-8'>
                            {sidebar.map((item) => (
                                <SidebarMenuItem key={item.name} >
                                    <SidebarMenuButton asChild className={`${pathname === item.url ? 'bg-gray-200' : ''}`}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <div className="flex justify-between items-center text-md px-2 py-2 gap-2 bg-sidebar-accent rounded-lg">
                        <Image
                            src="https://assets.citizenwallet.xyz/wallet-config/_images/ctzn.svg"
                            alt="CTZN"
                            width={28}
                            height={28}
                        />
                        <p className="flex-1 px-4 py-2">{balance.toFixed(2)}</p>
                        <Button variant="default" size="sm"
                            onClick={() => {
                                window.open(`/onramp?account=${account}`, '_blank');
                            }}
                        >
                            <PlusIcon />
                        </Button>
                    </div>

                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
        </>
    )
}
