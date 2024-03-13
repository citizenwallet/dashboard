"use client";

import { Flex, Heading, Separator, Text, Theme } from "@radix-ui/themes";
import Tabs, { Tab } from "./Tabs";
import { Button } from "@/components/ui/button";
import {
  ExternalLinkIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrevious } from "@/hooks/usePrevious";

interface SidebarProps {
  title: string;
}

export default function Sidebar({ title }: SidebarProps) {
  let tabs: Tab[] = [
    { href: `/admin/`, item: "", label: "Home" },
    { href: `/admin/faucet`, item: "faucet", label: "Faucet" },
  ];

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const previousPathname = usePrevious(pathname);

  useEffect(() => {
    if (previousPathname !== undefined && previousPathname !== pathname) {
      setOpen(false);
    }
  }, [pathname, previousPathname]);

  const handleContribute = () => {
    window.open(
      "https://github.com/citizenwallet/dashboard",
      "https://github.com/citizenwallet/dashboard"
    );
  };

  const handleCitizenWallet = () => {
    window.open("https://citizenwallet.xyz", "https://citizenwallet.xyz");
  };

  if (isDesktop === undefined) {
    return null;
  }

  if (isDesktop) {
    return (
      <Flex
        style={{ width: 300 }}
        direction="column"
        p="2"
        gap="2"
        className="animate-fadeIn max-h-screen min-h-screen bg-white"
      >
        <Heading>{title}</Heading>
        <Separator size="4" />
        <Tabs pathname={pathname} tabs={tabs} />
        <Flex grow="1"></Flex>
        <Flex direction="column">
          <Button variant="ghost" onClick={handleContribute}>
            <GitHubLogoIcon className="mr-2 h-4 w-4" /> Contribute
            <ExternalLinkIcon className="ml-2" />
          </Button>
          <Button variant="ghost" onClick={handleCitizenWallet}>
            Citizen Wallet
            <ExternalLinkIcon className="ml-2" />
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="absolute top-2 left-2" variant="outline">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Theme
          accentColor="purple"
          grayColor="sand"
          radius="large"
          className="h-full animate-fadeIn"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <Flex
            style={{ width: 300 }}
            direction="column"
            p="2"
            gap="2"
            className="h-full"
          >
            <Separator size="4" />
            <Tabs pathname={pathname} tabs={tabs} />
            <Flex grow="1"></Flex>
            <Flex direction="column">
              <Button variant="ghost" onClick={handleContribute}>
                <GitHubLogoIcon className="mr-2 h-4 w-4" /> Contribute
                <ExternalLinkIcon className="ml-1" />
              </Button>
              <Button variant="ghost" onClick={handleCitizenWallet}>
                Citizen Wallet
                <ExternalLinkIcon className="ml-1" />
              </Button>
            </Flex>
          </Flex>
        </Theme>
      </SheetContent>
    </Sheet>
  );
}
