import CreateFaucet from "@/containers/CreateFaucet";
import { Box, Button, Flex, Heading, Select } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex p="2">
        <Heading>Faucet</Heading>
      </Flex>
      <CreateFaucet />
    </Flex>
  );
}
