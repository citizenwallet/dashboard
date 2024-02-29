"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Config, useConfig, useContract } from "@citizenwallet/sdk";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box, Callout, Flex, Heading, Section } from "@radix-ui/themes";
import { useEffect } from "react";

// http://localhost:3000/faucet/0x48a5c3e5756bEA469d466932CF4A9fa735B689c5?slug=gratitude

export default function Container({
  config,
  faucetAddress,
}: {
  config: Config;
  faucetAddress: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [contractSubscribe, contractActions] = useContract(config);

  useEffect(() => {
    contractActions.checkExists(faucetAddress);
  }, [contractActions, faucetAddress]);

  const exists = contractSubscribe((state) => state.exists);
  const loading = contractSubscribe((state) => state.loading);

  if (!config) {
    return (
      <Flex direction="column" align="center" p="2">
        <Skeleton className="w-full max-w-screen-sm h-80 max-h-sm" />
      </Flex>
    );
  }

  const { token } = config;

  return (
    <Flex direction="column" px="4">
      <Flex p="2" pl={isDesktop ? "0" : "9"}>
        <Heading>{token.name} Faucet</Heading>
      </Flex>
      <Section size="1">
        {loading ? (
          <Skeleton className="w-full max-w-screen-sm h-80 max-h-sm" />
        ) : exists ? (
          <Card className="max-w-screen-sm">
            <CardHeader>
              <CardTitle>{token.name} Faucet</CardTitle>
              <CardDescription>
                This will create a faucet for a given token.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Box className="grid gap-1.5" py="2"></Box>
            </CardContent>
          </Card>
        ) : (
          <Callout.Root color="red">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>There is no faucet at this address.</Callout.Text>
          </Callout.Root>
        )}
      </Section>
    </Flex>
  );
}
