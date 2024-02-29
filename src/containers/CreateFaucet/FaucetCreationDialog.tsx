"use client";

import {
  Config,
  useCheckout,
  useFaucetFactoryContract,
} from "@citizenwallet/sdk";
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
  Flex,
  Separator,
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
import useMediaQuery from "@/hooks/useMediaQuery";
import { shortenAddress } from "@/utils/shortenAddress";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

import QRCode from "react-qr-code";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/utils/calculateProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { NETWORKS } from "@/constants/networks";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface FaucetCreationDialogProps {
  faucet: Faucet;
  config: Config;
}

export default function FaucetCreationDialog({
  faucet,
  config,
}: FaucetCreationDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { node, token } = config;

  const network = NETWORKS[node.chainId];

  const [subscribe, actions] = useCheckout(config);

  const [faucetFactorySubscribe, faucetFactoryActions] =
    useFaucetFactoryContract(config, actions.getSessionService());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [copied]);

  const handleOpenChange = (opened: boolean) => {
    setOpen(opened);

    if (opened) {
      actions.onLoad();
      actions.listenToBalance();
      actions.updateAmountToPay(async () => {
        if (!faucetFactoryActions.faucetFactoryService) {
          return;
        }
        return faucetFactoryActions.faucetFactoryService.estimateCreateSimpleFaucetWithDefaults(
          3,
          token.address,
          10,
          10
        );
      });
    } else {
      actions.stopListeners();
    }
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

  const handleRefund = async () => {
    actions.stopListeners();

    const success = await actions.refund();

    if (success) {
      toast({ description: "Refund successful" });
      handleClose();

      actions.reset();
      return;
    }

    toast({ description: "Failed to refund" });
    actions.listenToBalance();
  };

  const handleCreate = async (owner?: string) => {
    if (!owner) {
      toast({ description: "Unable to determine owner" });
      return;
    }

    actions.stopListeners();

    const faucetAddress = await faucetFactoryActions.createSimpleFaucet(
      owner,
      0,
      token.address,
      10,
      10,
      owner
    );

    if (faucetAddress) {
      await actions.refund();

      handleClose();
      toast({ description: "Faucet created" });

      actions.reset();

      // navigate to faucet
      router.push(`/faucet/${faucetAddress}`);
      return;
    }

    toast({ description: "Failed to create faucet" });
    actions.listenToBalance();
  };

  const sessionAddress = subscribe((state) => state.sessionAddress);
  const sessionBalance = subscribe((state) => state.sessionBalance);
  const amountToPay = subscribe((state) => state.amountToPay);
  const sessionOwner = subscribe((state) => state.sessionOwner);

  const tokenAddress = token.address;

  useEffect(() => {
    if (sessionOwner) {
      actions.updateAmountToPay(async () => {
        if (!faucetFactoryActions.faucetFactoryService) {
          return;
        }
        return faucetFactoryActions.faucetFactoryService.estimateCreateSimpleFaucet(
          sessionOwner,
          0,
          tokenAddress,
          10,
          10,
          sessionOwner
        );
      });
    }
  }, [actions, faucetFactoryActions, sessionOwner, tokenAddress]);

  const createLoading = faucetFactorySubscribe((state) => state.create.loading);

  const refund = subscribe((state) => state.refund);

  if (isDesktop === undefined) {
    return null;
  }

  const progress = calculateProgress(
    Number(sessionBalance.value),
    Number(amountToPay.value)
  );

  const isSufficientAmount = progress >= 100;

  const walletUrl = `ethereum:${sessionAddress.value}@${
    node.chainId
  }?value=${Math.max(Number(amountToPay.value - sessionBalance.value), 0)}`;

  const Content = () => (
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
                  value={walletUrl}
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
                  onClick={() => handleOpenWallet(walletUrl)}
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

  const Footer = () => (
    <Box className="w-full flex flex-col justify-center gap-6" px="4">
      {sessionOwner && sessionBalance.value > 0 && (
        <Button
          variant="ghost"
          className={
            !refund.loading ? "w-full max-w-sm" : "w-full max-w-sm opacity-50"
          }
          color="red"
          onClick={!refund.loading ? handleRefund : undefined}
        >
          Refund & Cancel
          {refund.loading && <PieChartIcon className="animate-spin" />}
        </Button>
      )}
      {isSufficientAmount && (
        <Button
          variant="soft"
          className="w-full max-w-sm"
          onClick={() => handleCreate(sessionOwner)}
        >
          Create
          {createLoading && <PieChartIcon className="animate-spin" />}
        </Button>
      )}
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
            <Content />
            <DialogFooter>
              <Footer />
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
          <Content />
          <DrawerFooter>
            <Footer />
          </DrawerFooter>
        </Theme>
      </DrawerContent>
    </Drawer>
  );
}
