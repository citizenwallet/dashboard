"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Section,
  Select,
  Text,
} from "@radix-ui/themes";
import FaucetCard from "./FaucetCard";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConfig } from "@citizenwallet/sdk";
import {
  CheckIcon,
  CopyIcon,
  PieChartIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import FaucetCreationDialog from "./FaucetCreationDialog";
import { shortenAddress } from "@/utils/shortenAddress";

export interface Faucet {
  id: string;
  title: string;
  description: string;
}

const faucets: Faucet[] = [
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
  const [slug, setSlug] = useState("gratitude");
  const [copied, setCopied] = useState(false);

  const [subscribe, actions] = useConfig();

  useEffect(() => {
    actions.getConfigs();
  }, [actions]);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleSelectFaucet = (id: string) => {
    setFaucet(id);
  };

  const handleSelectCommunity = (slug: string) => {
    setSlug(slug);
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const handleCreateFaucet = () => {
    console.log("create");
  };

  const communitiesLoading = subscribe((state) => state.loading);
  const communities = subscribe((state) => state.configs) || [];
  const selectedCommunity = communities.find((c) => c.community.alias === slug);
  const selectedFaucet = faucets.find((f) => f.id === faucet);

  const isValid = selectedCommunity && faucet && !communitiesLoading;

  return (
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
              {communitiesLoading ? (
                <Box height="7" className="flex justify-center items-center">
                  <PieChartIcon className="animate-spin" />
                </Box>
              ) : (
                <Box className="animate-fadeIn">
                  <Select.Root
                    defaultValue="gratitude"
                    onValueChange={handleSelectCommunity}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {communities
                        .filter((c) => !c.community.hidden)
                        .map(({ community }) => (
                          <Select.Item
                            key={community.alias}
                            value={community.alias}
                          >
                            {community.name}
                          </Select.Item>
                        ))}
                    </Select.Content>
                  </Select.Root>
                </Box>
              )}
            </Box>
            {selectedCommunity && (
              <Card className="animate-fadeIn">
                <CardHeader>
                  <CardTitle className="flex flex-row items-center">
                    <Image
                      src={selectedCommunity.community.logo}
                      alt="community logo"
                      height={40}
                      width={40}
                    />
                    {selectedCommunity.community.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedCommunity.community.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <Text>
                    <b>Name:</b> {selectedCommunity.token.name}
                  </Text>
                  <Text>
                    <b>Symbol:</b> {selectedCommunity.token.symbol}
                  </Text>
                  <Text>
                    <b>Standard:</b>{" "}
                    {selectedCommunity.token.standard.toUpperCase()}
                  </Text>
                  <Text>
                    <b>Decimals:</b> {selectedCommunity.token.decimals}
                  </Text>
                </CardContent>
                <CardFooter>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() =>
                      handleCopyAddress(selectedCommunity.token.address)
                    }
                  >
                    {shortenAddress(selectedCommunity.token.address)}{" "}
                    {copied ? (
                      <CheckIcon className="animate-fadeIn" />
                    ) : (
                      <CopyIcon className="animate-fadeIn" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            <Box className="grid gap-1.5" py="2">
              <Label>Faucet type</Label>
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
            {isValid && selectedFaucet && selectedCommunity ? (
              <FaucetCreationDialog
                faucet={selectedFaucet}
                config={selectedCommunity}
              />
            ) : (
              <Button className="opacity-50" variant="soft">
                Create <PlusIcon />
              </Button>
            )}
          </CardFooter>
        </Card>
      </Section>
    </Flex>
  );
}
