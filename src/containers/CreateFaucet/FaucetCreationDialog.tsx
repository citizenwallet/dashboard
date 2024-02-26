"use client";

import { Config, useCheckout } from "@citizenwallet/sdk";
import {
  ArrowTopRightIcon,
  CheckIcon,
  CopyIcon,
  PieChartIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Strong,
  Text,
  Theme,
} from "@radix-ui/themes";
import { Faucet } from ".";
import "@radix-ui/themes/styles.css";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/mediaQuery";
import { shortenAddress } from "@/utils/shortenAddress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

import QRCode from "react-qr-code";

interface FaucetCreationDialogProps {
  faucet: Faucet;
  config: Config;
}

export default function FaucetCreationDialog({
  faucet,
  config,
}: FaucetCreationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { community, token } = config;

  const [subscribe, actions] = useCheckout(config);

  useEffect(() => {
    if (open) {
      actions.onLoad();
      actions.listenBalance();
    }

    return () => {
      actions.stopListeners();
    };
  }, [open, actions]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  const sessionAddress = subscribe((state) => state.sessionAddress);
  const sessionBalance = subscribe((state) => state.sessionBalance);

  console.log(sessionBalance.loading);

  if (isDesktop === undefined) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" variant="soft">
            Create <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Theme accentColor="purple" grayColor="sand" radius="large">
            <DialogHeader>
              <DialogTitle>Create {faucet.title}</DialogTitle>
              <DialogDescription>{token.name}</DialogDescription>
            </DialogHeader>
            <div> hello</div>
            <DialogFooter>
              <Button variant="soft">Submit</Button>
            </DialogFooter>
          </Theme>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="soft" className="cursor-pointer">
          Create <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Theme accentColor="purple" grayColor="sand" radius="large">
          <DrawerHeader>
            <DrawerTitle>Create {faucet.title}</DrawerTitle>
            <DrawerDescription>{token.name}</DrawerDescription>
          </DrawerHeader>
          <Box className="w-full flex justify-center">
            <Card className="w-full max-w-sm">
              <CardContent>
                <Flex
                  direction="column"
                  p="4"
                  gap="2"
                  className="w-full max-w-sm"
                  justify="center"
                  align="center"
                >
                  {!sessionAddress.loading && (
                    <>
                      <Box className="p-4 border rounded-lg bg-white">
                        <QRCode
                          size={256}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          value={sessionAddress.value}
                          viewBox={`0 0 256 256`}
                        />
                      </Box>
                      <Button
                        variant="outline"
                        color="gray"
                        onClick={() => handleCopy(sessionAddress.value)}
                      >
                        {shortenAddress(sessionAddress.value)}{" "}
                        {copied ? <CheckIcon /> : <CopyIcon />}
                      </Button>
                    </>
                  )}
                  {!sessionBalance.loading && (
                    <>
                      <Flex justify="center" align="center" gap="1">
                        {" "}
                        <Text>
                          <Strong>Balance</Strong>
                        </Text>
                        <PieChartIcon className="animate-spin" />
                      </Flex>
                      <Text>{formatCurrency(sessionBalance.value, 18, 2)}</Text>
                    </>
                  )}
                </Flex>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">
                  Open wallet <ArrowTopRightIcon />
                </Button>
              </CardFooter>
            </Card>
          </Box>
          <DrawerFooter>
            <Box className="w-full flex justify-center" px="4">
              <Button variant="soft" className="w-full max-w-sm">
                Create
              </Button>
            </Box>
          </DrawerFooter>
        </Theme>
      </DrawerContent>
    </Drawer>
  );
}
