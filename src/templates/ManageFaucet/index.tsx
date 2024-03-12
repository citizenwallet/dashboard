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
  scrollRef,
  FaucetCard,
  FaucetTransfersHeading,
  FaucetTransfers,
}: {
  scrollRef?: React.RefObject<HTMLDivElement>;
  FaucetCard?: React.ReactNode;
  FaucetTransfersHeading?: React.ReactNode;
  FaucetTransfers?: React.ReactNode;
}) {
  return (
    <ScrollArea
      ref={scrollRef}
      className="max-h-screen min-h-screen flex flex-col"
    >
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          <Flex
            direction="column"
            p="4"
            gap="2"
            className="w-full"
            justify="center"
            align="center"
          >
            {FaucetCard || (
              <Box className="flex flex-col align-center gap-2 p-4 border rounded-lg bg-white">
                <Flex justify="between" align="center">
                  <Skeleton
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                  />
                  <Skeleton style={{ height: 40, width: 200 }} />
                </Flex>
                <Box className="p-4 border rounded-lg bg-white">
                  <Text>Faucet</Text>
                  <Skeleton style={{ height: 256, width: 256 }} />
                  <Flex justify="between" align="center" pt="2">
                    <Skeleton
                      style={{ height: 32, width: 92 }}
                      className="w-full"
                    />
                    <Skeleton
                      style={{ height: 32, width: 92 }}
                      className="w-full"
                    />
                  </Flex>
                </Box>
                <Flex align="center" gap="2">
                  <Text>Balance: </Text>
                  <Skeleton
                    style={{ height: 24, width: 40 }}
                    className="w-full"
                  />
                </Flex>
                <Separator size="4" />
                <Flex align="center" gap="2">
                  <Text>Redeem interval: </Text>
                  <Skeleton
                    style={{ height: 24, width: 40 }}
                    className="w-full"
                  />
                </Flex>
                <Flex align="center" gap="2">
                  <Text>Redeem amount: </Text>
                  <Skeleton
                    style={{ height: 24, width: 40 }}
                    className="w-full"
                  />
                </Flex>
                <Flex justify="end" align="center" gap="2" pt="2">
                  <Skeleton
                    style={{ height: 32, width: 92 }}
                    className="w-full"
                  />
                </Flex>
              </Box>
            )}
          </Flex>
        </Section>
      </Flex>
      <Flex justify="center" className="w-full">
        <Flex
          shrink="0"
          grow="1"
          direction="column"
          gap="2"
          p="4"
          className="relative max-w-md"
        >
          <Separator size="4" />
          {FaucetTransfersHeading || (
            <Box className="z-50 sticky top-0 left-0 bg-white py-4">
              <Text>Transactions</Text>
            </Box>
          )}
          {FaucetTransfers ||
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} style={{ height: 64 }} />
            ))}
        </Flex>
      </Flex>
    </ScrollArea>
  );
}
