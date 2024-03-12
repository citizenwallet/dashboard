import { Skeleton } from "@/components/ui/skeleton";

import {
  Box,
  Flex,
  ScrollArea,
  Section,
  Separator,
  Text,
} from "@radix-ui/themes";

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
        <Box className="flex flex-col align-center gap-2 p-4 border rounded-lg bg-white">
          <Flex justify="between" align="center">
            <Skeleton style={{ height: 40, width: 40, borderRadius: 20 }} />
            <Skeleton style={{ height: 40, width: 200 }} />
          </Flex>
          <Box className="p-4 border rounded-lg bg-white">
            <Text>Faucet</Text>
            <Skeleton style={{ height: 256, width: 256 }} />
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
