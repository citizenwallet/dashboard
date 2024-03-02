import { Flex, Heading, Section, Text } from "@radix-ui/themes";

export default function Template({
  Content,
  description,
}: {
  Content?: React.ReactNode;
  description: string;
}) {
  return (
    <Flex
      direction="column"
      height="100%"
      width="100%"
      justify="center"
      align="center"
      p="4"
      className="fadeIn min-h-screen"
    >
      {Content ? <Section size="3">{Content}</Section> : null}
      <Section size="1">
        <Text size="6">{description}</Text>
      </Section>
    </Flex>
  );
}
