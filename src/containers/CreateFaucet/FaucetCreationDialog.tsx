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
  Separator,
  Strong,
  Text,
  Theme,
} from "@radix-ui/themes";
import { Faucet } from ".";
import "@radix-ui/themes/styles.css";
import { useEffect, useRef, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/utils/calculateProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { NETWORKS } from "@/constants/networks";
import { useToast } from "@/components/ui/use-toast";

interface FaucetCreationDialogProps {
  faucet: Faucet;
  config: Config;
}

export default function FaucetCreationDialog({
  faucet,
  config,
}: FaucetCreationDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const firstOpenRef = useRef(true);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { community, node, token } = config;

  const network = NETWORKS[node.chainId];

  const [subscribe, actions] = useCheckout(config);

  useEffect(() => {
    if (open) {
      firstOpenRef.current = false;
      actions.onLoad();
      actions.listenBalance();
      actions.estimateAmountToPay(
        "0x0654b3e97424e181e169c2f877d7ef06953abb5e",
        0,
        "0x5815E61eF72c9E6107b5c5A05FD121F334f7a7f1",
        10,
        10,
        "0x0654b3e97424e181e169c2f877d7ef06953abb5e"
      );
    }

    return () => {
      if (!open && !firstOpenRef.current) {
        actions.stopListeners();
      }
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  const handleOpenWallet = (url: string) => {
    window.open(url, "_blank");
  };

  const handleCreate = async () => {
    console.log("create");
    actions.createSimpleFaucet(
      "0x0654b3e97424e181e169c2f877d7ef06953abb5e",
      0,
      "0x5815E61eF72c9E6107b5c5A05FD121F334f7a7f1",
      10,
      10,
      "0x0654b3e97424e181e169c2f877d7ef06953abb5e"
    );
  };

  const sessionAddress = subscribe((state) => state.sessionAddress);
  const sessionBalance = subscribe((state) => state.sessionBalance);
  const amountToPay = subscribe((state) => state.amountToPay);

  const createLoading = subscribe((state) => state.createLoading);
  const createError = subscribe((state) => state.createError);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (createLoading && !createError) {
        console.log("toasting...");
        handleClose();
        toast({ description: "Faucet created" });
      }
    };
  }, [toast, createLoading, createError]);

  console.log("createLoading", createLoading);
  console.log("createError", createError);

  if (isDesktop === undefined) {
    return null;
  }

  const progress = calculateProgress(
    Number(sessionBalance.value),
    Number(amountToPay.value)
  );

  const isSufficientAmount = progress >= 100;

  const Content = (
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
            <Box className="p-4 border rounded-lg bg-white">
              {sessionAddress.loading ? (
                <Skeleton style={{ height: 256, width: 256 }} />
              ) : (
                <QRCode
                  size={256}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                  value={`ethereum:${sessionAddress.value}@${node.chainId}?value=${amountToPay.value}`}
                  viewBox={`0 0 256 256`}
                />
              )}
            </Box>
            {sessionAddress.loading ? (
              <>
                <Skeleton style={{ height: 32, width: 126 }} />
                <Skeleton style={{ height: 32, width: 126 }} />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  color="gray"
                  onClick={() => handleCopy(sessionAddress.value)}
                >
                  {shortenAddress(sessionAddress.value)}{" "}
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleOpenWallet(
                      `ethereum:${sessionAddress.value}@${node.chainId}?value=${amountToPay.value}`
                    )
                  }
                >
                  Open wallet <ArrowTopRightIcon />
                </Button>
              </>
            )}

            <Separator size="4" />
            <Text>
              <Strong>Fund transaction</Strong>
            </Text>

            <Flex direction="column" className="w-full" gap="2">
              <Flex justify="center" gap="1">
                <Text>Needed: </Text>
                <Text>{formatCurrency(amountToPay.value, 18, 5)}</Text>
                <Text>{network.symbol}</Text>
              </Flex>
              <Flex>
                <Progress
                  className={
                    isSufficientAmount ? "border border-green-400" : ""
                  }
                  value={progress}
                />
                {isSufficientAmount ? (
                  <CheckIcon color="green" />
                ) : (
                  <PieChartIcon className="animate-spin" />
                )}
              </Flex>
              <Flex justify="center" gap="1">
                <Text
                  className="transition-colors duration-150"
                  color={
                    isSufficientAmount
                      ? "green"
                      : sessionBalance.loading
                      ? "orange"
                      : undefined
                  }
                >
                  {formatCurrency(sessionBalance.value, 18, 5)}
                </Text>
                <Text className="transition-colors duration-150">
                  {network.symbol}
                </Text>
              </Flex>
              <Flex justify="center">
                <Text>
                  {isSufficientAmount
                    ? "Ready to create"
                    : "Waiting for funds..."}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </CardContent>
      </Card>
    </Box>
  );

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
            {Content}
            <DialogFooter>
              <Box className="w-full flex justify-center" px="4">
                <Button
                  variant="soft"
                  className={
                    isSufficientAmount
                      ? "w-full max-w-sm"
                      : "w-full max-w-sm opacity-50"
                  }
                  onClick={isSufficientAmount ? handleCreate : undefined}
                >
                  {isSufficientAmount ? "Create" : "Insufficient funds"}
                  {createLoading && <PieChartIcon className="animate-spin" />}
                </Button>
              </Box>
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
          {Content}
          <DrawerFooter>
            <Box className="w-full flex justify-center" px="4">
              <Button
                variant="soft"
                className={
                  isSufficientAmount
                    ? "w-full max-w-sm"
                    : "w-full max-w-sm opacity-50"
                }
                onClick={isSufficientAmount ? handleCreate : undefined}
              >
                {isSufficientAmount ? "Create" : "Insufficient funds"}
                {createLoading && <PieChartIcon className="animate-spin" />}
              </Button>
            </Box>
          </DrawerFooter>
        </Theme>
      </DrawerContent>
    </Drawer>
  );
}
