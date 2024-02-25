import { Flex, Heading, Separator } from "@radix-ui/themes";
import Tabs, { Tab } from "./Tabs";

const tabs: Tab[] = [
  { href: "/", label: "Home" },
  { href: "/faucet", label: "Faucet" },
];

export default function Sidebar() {
  return (
    <Flex style={{ width: 300 }} direction="column" height="100%" p="2" gap="2">
      <Heading>Citizen Wallet</Heading>
      <Separator size="4" />
      <Tabs tabs={tabs} />
    </Flex>
  );
}
