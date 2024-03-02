"use client";

import { Box, Button, Select, Text, TextField } from "@radix-ui/themes";
import FaucetCard from "./FaucetCard";
import CreateFaucetTemplate from "@/templates/CreateFaucet";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Config } from "@citizenwallet/sdk";
import { CheckIcon, CopyIcon, PlusIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import FaucetCreationDialog from "./FaucetCreationDialog";
import { shortenAddress } from "@/utils/shortenAddress";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useSafeEffect } from "@/hooks/useSafeEffect";
import { Label } from "@/components/ui/label";
import { readableDuration } from "@/utils/duration";

export interface Faucet {
  id: string;
  title: string;
  description: string;
}

const faucets: Faucet[] = [
  {
    id: "single",
    title: "Single Redeem",
    description: "Users can only redeem once.",
  },
  {
    id: "multi",
    title: "Interval Redeem",
    description: "Users can redeem after an interval has passed.",
  },
];

const DEFAULT_REDEEM_AMOUNT = 1;
const DEFAULT_REDEEM_INTERVAL = 86400;

export default function CreateFaucet({
  communities,
}: {
  communities: Config[];
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [redeemAmount, setRedeemAmount] = useState(DEFAULT_REDEEM_AMOUNT);
  const [redeemInterval, setRedeemInterval] = useState(DEFAULT_REDEEM_INTERVAL);

  const [faucet, setFaucet] = useState(faucets[0].id);
  const [slug, setSlug] = useState("gratitude");
  const [copied, setCopied] = useState(false);

  const [open, setOpen] = useState(false);

  const handleOpenChange = (opened: boolean) => {
    setOpen(opened);
  };

  useSafeEffect(() => {
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

  const handleRedeemAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    if (isNaN(amount)) return;

    setRedeemAmount(amount >= 1 ? amount : 1);
  };

  const handleRedeemInterval = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interval = Number(e.target.value);
    if (isNaN(interval)) return;

    setRedeemInterval(interval >= 1 ? interval : 1);
  };

  const selectedCommunity = communities.find((c) => c.community.alias === slug);

  const selectedFaucet = faucets.find((f) => f.id === faucet);

  const durationText = readableDuration(redeemInterval);

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
                  <CheckIcon
                    height={14}
                    width={14}
                    className="animate-fadeIn"
                  />
                ) : (
                  <CopyIcon height={14} width={14} className="animate-fadeIn" />
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
      FaucetConfiguration={
        <>
          <Text>Faucet configuration</Text>
          <Label>Redeem Amount</Label>
          <Text size="1">
            How much does the faucet give to the user when they redeem?
          </Text>
          <TextField.Root>
            <TextField.Slot>
              <Text>{selectedCommunity?.token.symbol}</Text>
            </TextField.Slot>
            <TextField.Input
              type="number"
              min={1}
              placeholder="1"
              size="3"
              value={redeemAmount}
              onChange={handleRedeemAmount}
            />
          </TextField.Root>
          {selectedFaucet?.id === "multi" && (
            <>
              <Label>Redeem Interval</Label>
              <Text size="1">
                How often can the user redeem from the faucet?
              </Text>
              <TextField.Root>
                <TextField.Input
                  type="number"
                  min={1}
                  placeholder="86400"
                  size="3"
                  value={redeemInterval}
                  onChange={handleRedeemInterval}
                />
                <TextField.Slot>
                  <Text size="1">in seconds</Text>
                </TextField.Slot>
              </TextField.Root>
              <Text size="1" className="px-4">
                {durationText}
              </Text>
            </>
          )}
        </>
      }
      FaucetCreationDialog={
        !!(selectedFaucet && selectedCommunity) ? (
          <>
            <Button
              variant="soft"
              className="cursor-pointer"
              onClick={() => handleOpenChange(true)}
            >
              Create <PlusIcon height={14} width={14} />
            </Button>
            {isDesktop ? (
              <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent>
                  {open ? (
                    <FaucetCreationDialog
                      isDesktop
                      faucet={selectedFaucet}
                      config={selectedCommunity}
                      redeemAmount={redeemAmount}
                      redeemInterval={redeemInterval}
                      handleClose={() => handleOpenChange(false)}
                    />
                  ) : (
                    <Box className="min-h-[600px] min-w-[460px]" />
                  )}
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer open={open} onOpenChange={handleOpenChange}>
                <DrawerContent>
                  {open ? (
                    <FaucetCreationDialog
                      faucet={selectedFaucet}
                      config={selectedCommunity}
                      redeemAmount={redeemAmount}
                      redeemInterval={redeemInterval}
                      handleClose={() => handleOpenChange(false)}
                    />
                  ) : (
                    <Box className="min-h-[600px]" />
                  )}
                </DrawerContent>
              </Drawer>
            )}
          </>
        ) : undefined
      }
    />
  );
}
