import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Component({
  avatar,
  avatarFallback,
  title,
  description,
  CardAction,
}: {
  avatar?: string;
  avatarFallback: string;
  title: string;
  description?: string;
  CardAction?: React.ReactNode;
}) {
  return (
    <Card className="min-w-[160px]" style={{ maxWidth: 240 }}>
      <Flex gap="3" align="center">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <Box>
          <Text as="div" size="2" weight="bold">
            {title}
          </Text>
          {description && (
            <Text as="div" size="2" color="gray">
              {description}
            </Text>
          )}
        </Box>
        {CardAction && CardAction}
      </Flex>
    </Card>
  );
}
