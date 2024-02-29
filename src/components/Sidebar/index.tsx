"use client";

import { Flex, Heading, Separator, Text, Theme } from "@radix-ui/themes";
import Tabs, { Tab } from "./Tabs";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import useMediaQuery from "@/hooks/useMediaQuery";

const tabs: Tab[] = [
  { href: "/", label: "Home" },
  { href: "/faucet", label: "Faucet" },
];

export default function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleContribute = () => {
    window.open(
      "https://github.com/citizenwallet/dashboard",
      "https://github.com/citizenwallet/dashboard"
    );
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
        className="animate-fadeIn"
      >
        <Heading>Citizen Wallet</Heading>
        <Separator size="4" />
        <Tabs tabs={tabs} />
        <Flex grow="1"></Flex>
        <Flex direction="column">
          <Button variant="ghost" onClick={handleContribute}>
            <GitHubLogoIcon className="mr-2 h-4 w-4" /> Contribute
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Sheet>
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
            <SheetTitle>Citizen Wallet</SheetTitle>
          </SheetHeader>
          <Flex
            style={{ width: 300 }}
            direction="column"
            p="2"
            gap="2"
            className="h-full"
          >
            <Separator size="4" />
            <Tabs tabs={tabs} />
            <Flex grow="1"></Flex>
            <Flex direction="column">
              <Button variant="ghost" onClick={handleContribute}>
                <GitHubLogoIcon className="mr-2 h-4 w-4" /> Contribute
              </Button>
            </Flex>
          </Flex>
        </Theme>
      </SheetContent>
    </Sheet>
  );
}
