"use client";

import { Flex, Heading, Separator, Text } from "@radix-ui/themes";
import Tabs, { Tab } from "./Tabs";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const tabs: Tab[] = [
  { href: "/", label: "Home" },
  { href: "/faucet", label: "Faucet" },
];

export default function Sidebar() {
  const handleContribute = () => {
    window.open(
      "https://github.com/citizenwallet/dashboard",
      "https://github.com/citizenwallet/dashboard"
    );
  };

  return (
    <Flex style={{ width: 300 }} direction="column" p="2" gap="2">
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
