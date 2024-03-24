import { Box, Button, Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import Image from "next/image";
import OnboardingWelcomeIcon from "@/assets/icons/onboarding-welcome.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Template({
  Content,
  ActionBar,
}: {
  Content?: React.ReactNode;
  ActionBar?: React.ReactNode;
}) {
  return (
    <Flex
      direction="column"
      height="100%"
      width="100%"
      justify="start"
      align="center"
      p="4"
      className="relative fadeIn min-h-screen max-w-screen-sm mx-auto gap-8 animate-fadeIn"
    >
      <Heading size="8">Community Setup</Heading>
      <Image
        src={OnboardingWelcomeIcon}
        alt="group of people collaborating"
        height={160}
        width={160}
      />
      <Text size="5" align="center">
        Some additional information is needed in order to configure your
        community.
      </Text>
      <Box className="w-full h-[1px] bg-gray-200">
        {Content || <Skeleton style={{ height: 210 }} className="w-full" />}
        <Box style={{ height: 100 }} />
      </Box>
      {ActionBar}
    </Flex>
  );
}
