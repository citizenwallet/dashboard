"use client";

import { Box, Button, Flex, Grid, Section, Select } from "@radix-ui/themes";
import FaucetCard from "./FaucetCard";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { useConfig } from "@citizenwallet/sdk";

const faucets = [
  {
    id: "simple",
    title: "Simple Faucet",
    description: "Users can redeem once.",
  },
  {
    id: "redeem-code",
    title: "Redeem Code Faucet",
    description: "Users can redeem using a code.",
  },
];

export default function CreateFaucet() {
  const [faucet, setFaucet] = useState(faucets[0].id);

  const chains: any[] = [];
  //   const [subscribe, actions] = useConfig();

  //   useEffect(() => {
  //     actions.getConfigs();
  //   }, [actions]);

  const handleSelectFaucet = (id: string) => {
    setFaucet(id);
  };

  //   const communities = subscribe(state => true);

  return (
    <Flex direction="column" align="center" p="2">
      <Section size="1">
        <Card className="w-[650px]">
          <CardHeader>
            <CardTitle>Create a faucet</CardTitle>
            <CardDescription>
              This will create a faucet for a given token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Box py="2">
              <Select.Root defaultValue="42220">
                <Select.Trigger />
                <Select.Content>
                  {chains.map((chain) => (
                    <Select.Item key={chain.chainId} value={`${chain.chainId}`}>
                      {chain.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
            <Box className="grid gap-1.5" py="2">
              <Label htmlFor="address">ERC20 Token Address</Label>
              <Input type="address" placeholder="0x..." />
            </Box>
            <Box py="2">
              <Grid columns={{ initial: "1", md: "2" }} gap="3">
                {faucets.map((f) => (
                  <FaucetCard
                    key={f.id}
                    id={f.id}
                    title={f.title}
                    description={f.description}
                    active={f.id === faucet}
                    onClick={handleSelectFaucet}
                  />
                ))}
              </Grid>
            </Box>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Create</Button>
          </CardFooter>
        </Card>
      </Section>
    </Flex>
  );
}
