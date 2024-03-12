import { Box, Flex, Grid, Section } from "@radix-ui/themes";
import { Skeleton } from "@/components/ui/skeleton";

export default function Template({ Picker }: { Picker?: React.ReactNode }) {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          {Picker || (
            <Grid
              display="grid"
              columns={{ initial: "1", sm: "2", md: "3" }}
              gap="3"
              width="auto"
            >
              <Skeleton style={{ height: 120, width: 200 }} />
              <Skeleton style={{ height: 120, width: 200 }} />
              <Skeleton style={{ height: 120, width: 200 }} />
            </Grid>
          )}
        </Section>
      </Flex>
    </Flex>
  );
}
