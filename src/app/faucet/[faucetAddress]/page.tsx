import { Flex, Heading } from "@radix-ui/themes";

export default function Faucet({
  params: { faucetAddress },
}: {
  params: { faucetAddress: string };
}) {
  console.log(faucetAddress);
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex p="2" pl="9">
        <Heading>Faucet {faucetAddress}</Heading>
      </Flex>
    </Flex>
  );
}
