import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DotIcon } from "@radix-ui/react-icons";
import { Box, Flex, Grid, Section } from "@radix-ui/themes";

export default function Template({
  CommunityPicker,
  CommunityCard,
  FaucetCards,
  FaucetCreationDialog,
}: {
  CommunityPicker?: React.ReactNode;
  CommunityCard?: React.ReactNode;
  FaucetCards?: React.ReactNode;
  FaucetCreationDialog?: React.ReactNode;
}) {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          <Card className="max-w-screen-sm">
            <CardHeader>
              <CardTitle>Create a faucet</CardTitle>
              <CardDescription>
                This will create a faucet for a given token.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Box className="grid gap-1.5" py="2">
                <Label>Pick a community</Label>
                <Box className="animate-fadeIn">
                  {CommunityPicker ?? (
                    <Skeleton style={{ height: 32, width: 145 }} />
                  )}
                </Box>
              </Box>
              {CommunityCard ?? (
                <Skeleton style={{ height: 292 }} className="w-full" />
              )}
              <Box className="grid gap-1.5" py="2">
                <Label>Faucet type</Label>
                <Grid columns={{ initial: "1", md: "2" }} gap="3">
                  {FaucetCards ?? (
                    <>
                      <Card
                        className="relative border-grey"
                        style={{
                          maxWidth: 300,
                          borderColor: "grey",
                        }}
                      >
                        <DotIcon className="absolute right-1 top-1" />
                        <CardHeader>
                          <CardTitle>
                            <Skeleton style={{ height: 24, width: 230 }} />
                          </CardTitle>
                          <CardDescription>
                            <Skeleton style={{ height: 20, width: 230 }} />
                          </CardDescription>
                        </CardHeader>
                      </Card>
                      <Card
                        className="relative border-grey"
                        style={{
                          maxWidth: 300,
                          borderColor: "grey",
                        }}
                      >
                        <DotIcon className="absolute right-1 top-1" />
                        <CardHeader>
                          <CardTitle>
                            <Skeleton style={{ height: 24, width: 230 }} />
                          </CardTitle>
                          <CardDescription>
                            <Skeleton style={{ height: 20, width: 230 }} />
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </>
                  )}
                </Grid>
              </Box>
            </CardContent>
            <CardFooter className="flex justify-end">
              {FaucetCreationDialog ?? (
                <Skeleton
                  style={{ height: 32, width: 92 }}
                  className="w-full"
                />
              )}
            </CardFooter>
          </Card>
        </Section>
      </Flex>
    </Flex>
  );
}