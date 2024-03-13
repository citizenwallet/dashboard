import { Skeleton } from "@/components/ui/skeleton";

import { Box, Flex, Text } from "@radix-ui/themes";

export default function Template({
  FaucetCard,
}: {
  FaucetCard?: React.ReactNode;
}) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      p="2"
      className="max-h-screen min-h-screen"
    >
      {FaucetCard || (
        <Box className="w-[330px] flex flex-col align-center gap-2 p-4 border rounded-lg bg-white">
          <Text weight="bold" size="5">
            Faucet
          </Text>
          <Flex justify="between" align="center">
            <Skeleton style={{ height: 40, width: 40, borderRadius: 20 }} />
            <Skeleton style={{ height: 40, width: 200 }} />
          </Flex>
          <Box className="p-4 border rounded-lg bg-white">
            <Text>Redeem</Text>
            <Skeleton style={{ height: 262, width: 262 }} className="p-1" />
            <Flex justify="between" align="center" pt="2">
              <Skeleton style={{ height: 32, width: 92 }} className="w-full" />
              <Skeleton style={{ height: 32, width: 92 }} className="w-full" />
            </Flex>
          </Box>
          <Flex align="center" gap="2">
            <Text>Redeem interval: </Text>
            <Skeleton style={{ height: 24, width: 40 }} className="w-full" />
          </Flex>
          <Flex align="center" gap="2">
            <Text>Redeem amount: </Text>
            <Skeleton style={{ height: 24, width: 40 }} className="w-full" />
          </Flex>
          <Flex justify="end" align="center" gap="2" pt="2">
            <Skeleton style={{ height: 32, width: 92 }} className="w-full" />
          </Flex>
        </Box>
      )}
    </Flex>
  );
}
