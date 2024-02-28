import CreateFaucet from "@/containers/CreateFaucet";
import { Flex, Heading } from "@radix-ui/themes";

export default function Faucet() {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex p="2" pl="9">
        <Heading>Faucet</Heading>
      </Flex>
      <CreateFaucet />
    </Flex>
  );
}
