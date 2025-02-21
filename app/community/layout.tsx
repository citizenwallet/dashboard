import Link from 'next/link';
import { Home, LayoutTemplate, LineChart, PanelLeft, Users2, CreditCard, LayoutDashboard } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Analytics } from '@vercel/analytics/react';
import { User } from '@/components/custom/user';
import { CommunityLogo } from '@/components/icons';
// import Providers from './providers'; // Removing since module not found
import { NavItem } from '@/components/custom/nav-item';
import { SearchInput } from '@/components/custom/url-search';
import Providers from './providers';
import { SidebarMenuItem } from '@/components/custom/sidebar-menu';

// TODO: read from community config of alias
const community = {
  alias: 'bread',
  name: 'Breadchain Community Token',
  url: 'https://breadchain.xyz/',
  logoUrl: 'https://bread.citizenwallet.xyz/uploads/logo.svg',
  tokenSymbol: 'BREAD'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40 overflow-x-hidden">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-[10rem]">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex w-full items-center justify-between sm:justify-end">
              <MobileNav />
              <User />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-auto z-10 hidden w-[10.5rem] flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <span className="text-xl font-bold text-primary tracking-wide">
          Citizen Wallet
        </span>
        <SidebarMenuItem href="/community" label="Community" icon={<LayoutTemplate className="h-5 w-5" />} />
        
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav className="grid gap-6 text-lg font-medium">

          <span className="text-xl font-bold text-primary tracking-wide">
            Citizen Wallet
          </span>
          <SidebarMenuItem href="/community" label="Community" icon={<LayoutTemplate className="h-5 w-5" />} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>All Products</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
