import { Box, Button, Flex, Heading } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex p="2">
        <Heading>Faucet</Heading>
      </Flex>
      <Flex p="2">
        <Box>
          <Button>Click me</Button>
        </Box>
      </Flex>
    </Flex>
  );
}
