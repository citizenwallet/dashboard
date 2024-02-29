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
import CreateFaucetTemplate from "@/templates/CreateFaucet";
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
import { Config, useConfig } from "@citizenwallet/sdk";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import FaucetCreationDialog from "./FaucetCreationDialog";
import { shortenAddress } from "@/utils/shortenAddress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffectOnce } from "@/hooks/useEffectOnce";

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

export default function CreateFaucet({
  communities,
}: {
  communities: Config[];
}) {
  const [faucet, setFaucet] = useState(faucets[0].id);
  const [slug, setSlug] = useState("gratitude");
  const [copied, setCopied] = useState(false);

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

  const selectedCommunity = communities.find((c) => c.community.alias === slug);

  const selectedFaucet = faucets.find((f) => f.id === faucet);

  return (
    <CreateFaucetTemplate
      CommunityPicker={
        <Select.Root
          defaultValue="gratitude"
          onValueChange={handleSelectCommunity}
        >
          <Select.Trigger />
          <Select.Content>
            {communities
              .filter((c) => !c.community.hidden)
              .map(({ community }) => (
                <Select.Item key={community.alias} value={community.alias}>
                  {community.name}
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Root>
      }
      CommunityCard={
        selectedCommunity ? (
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
        ) : undefined
      }
      FaucetCards={faucets.map((f) => (
        <FaucetCard
          key={f.id}
          id={f.id}
          title={f.title}
          description={f.description}
          active={f.id === faucet}
          onClick={handleSelectFaucet}
        />
      ))}
      FaucetCreationDialog={
        !!(selectedFaucet && selectedCommunity) ? (
          <FaucetCreationDialog
            faucet={selectedFaucet}
            config={selectedCommunity}
          />
        ) : undefined
      }
    />
  );
}
