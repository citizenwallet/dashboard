import { formatCurrency } from "@/utils/formatCurrency";
import { shortenAddress } from "@/utils/shortenAddress";
import { ConfigToken, Transfer } from "@citizenwallet/sdk";
import { PlusIcon } from "@radix-ui/react-icons";
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";

export default function Component({
  account,
  transfer: tx,
  token,
}: {
  account: string;
  transfer: Transfer;
  token: ConfigToken;
}) {
  const isTopUp = tx.to === account;
  return (
    <Card key={tx.hash}>
      <Flex justify="between">
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            src={`https://api.multiavatar.com/${tx.from}.png`}
            radius="full"
            fallback="T"
          />
          <Box>
            <Text as="div" size="2" weight="bold">
              {isTopUp ? "Top up" : "Redeem"}
            </Text>
            <Text as="div" size="2" color="gray">
              {shortenAddress(tx.from)}
            </Text>
          </Box>
        </Flex>
        <Flex gap="3" align="center">
          {isTopUp && <PlusIcon height={14} width={14} color="purple" />}
          <Text color={isTopUp ? "purple" : undefined}>
            {formatCurrency(BigInt(tx.value), token.decimals, 2)} {token.symbol}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
