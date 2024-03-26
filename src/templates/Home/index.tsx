import { Skeleton } from "@/components/ui/skeleton";
import { Box, Flex, Text } from "@radix-ui/themes";

interface Props {
  QRCode?: React.ReactNode;
}

export default function Template({ QRCode }: Props) {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        {QRCode || (
          <Box className="p-4 border rounded-lg bg-white">
            <Text>Import Community</Text>
            <Skeleton style={{ height: 262, width: 262 }} className="p-1" />
            <Flex justify="between" align="center" pt="2">
              <Skeleton style={{ height: 32, width: 92 }} className="w-full" />
              <Skeleton style={{ height: 32, width: 92 }} className="w-full" />
            </Flex>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
