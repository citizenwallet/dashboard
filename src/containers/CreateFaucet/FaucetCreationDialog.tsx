"use client";

import {
  Config,
  NETWORKS,
  useCheckout,
  useFaucetFactoryContract,
} from "@citizenwallet/sdk";
import {
  ArrowTopRightIcon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  LinkNone2Icon,
  PieChartIcon,
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
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { shortenAddress } from "@/utils/shortenAddress";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";

import QRCode from "react-qr-code";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/utils/calculateProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import OwnerAvatarBadge from "@/components/OwnerAvatarBadge";
import ModifyOwner from "./ModifyOwner";
import { readableDuration } from "@/utils/duration";
import { useSafeEffect } from "@/hooks/useSafeEffect";
import { generateEIP681Link } from "@/utils/eip681Link";

interface FaucetCreationDialogProps {
  isDesktop?: boolean;
  faucet: Faucet;
  config: Config;
  redeemAmount: number;
  redeemInterval: number;
  handleClose: () => void;
}

// state.js:57 Warning: Cannot update a component (`FaucetCreationDialog`) while rendering a different component (`FaucetCreationDialog`). To locate the bad setState() call inside `FaucetCreationDialog`, follow the stack trace as described in
export default function FaucetCreationDialog({
  isDesktop,
  faucet,
  config,
  redeemAmount,
  redeemInterval,
  handleClose,
}: FaucetCreationDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [openModifyOwner, setOpenModifyOwner] = useState(false);
  const [copied, setCopied] = useState(false);

  const { node, token } = config;

  const network = NETWORKS[node.chain_id];

  const [subscribe, actions] = useCheckout(network);

  const [faucetFactorySubscribe, faucetFactoryActions] =
    useFaucetFactoryContract(config, actions.getSessionService());

  useSafeEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useSafeEffect(() => {
    return () => {
      actions.stopListeners();
    };
  }, [actions]);

  useSafeEffect(() => {
    actions.onLoad();
    actions.listenToBalance();
    actions.updateAmountToPay(async (signer) => {
      if (!faucetFactoryActions.faucetFactoryService) {
        return;
      }
      return faucetFactoryActions.faucetFactoryService.estimateCreateSimpleFaucet(
        signer.address,
        0,
        token.address,
        redeemAmount,
        redeemInterval,
        signer.address
      );
    });
  }, [
    actions,
    faucetFactoryActions,
    token.address,
    redeemAmount,
    redeemInterval,
  ]);

  const handleOpenModifyOwner = (opened: boolean) => {
    setOpenModifyOwner(opened);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
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
      redeemAmount,
      redeemInterval,
      owner
    );

    if (faucetAddress) {
      await actions.refund();

      handleClose();
      toast({ description: "Faucet created" });

      actions.reset();

      // navigate to faucet
      router.push(`/admin/${config.community.alias}/faucet/${faucetAddress}`);
      return;
    }

    toast({ description: "Failed to create faucet" });
    actions.listenToBalance();
  };

  const sessionAddress = subscribe((state) => state.sessionAddress);
  const sessionBalance = subscribe((state) => state.sessionBalance);
  const amountToPay = subscribe((state) => state.amountToPay);
  const sessionOwner = subscribe((state) => state.sessionOwner);
  const sessionOwnerError = subscribe((state) => state.sessionOwnerError);

  const shortenedOwner = shortenAddress(sessionOwner);

  const tokenAddress = token.address;

  useSafeEffect(() => {
    if (sessionOwner) {
      actions.updateAmountToPay(async () => {
        if (!faucetFactoryActions.faucetFactoryService) {
          return;
        }
        return faucetFactoryActions.faucetFactoryService.estimateCreateSimpleFaucet(
          sessionOwner,
          0,
          tokenAddress,
          redeemAmount,
          redeemInterval,
          sessionOwner
        );
      });
    }
  }, [
    actions,
    faucetFactoryActions,
    sessionOwner,
    tokenAddress,
    redeemAmount,
    redeemInterval,
  ]);

  const createLoading = faucetFactorySubscribe((state) => state.create.loading);

  const refund = subscribe((state) => state.refund);

  const progress = calculateProgress(
    Number(sessionBalance.value),
    Number(amountToPay.value)
  );

  const isSufficientAmount = progress >= 100;

  const qrLink = generateEIP681Link({
    address: sessionAddress.value,
    chainId: node.chain_id,
    amount: Math.max(Number(amountToPay.value - sessionBalance.value), 0),
  });

  const durationText = readableDuration(redeemInterval);

  const FundingCardContent = (
    <CardContent className="fadeIn">
      <Flex
        direction="column"
        p="4"
        gap="2"
        className="w-full max-w-sm"
        justify="center"
        align="center"
      >
        <Text size="2" className="text-center">
          Send <Strong>{network.symbol}</Strong> to the following address to
          fund the faucet creation.
        </Text>
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
              value={qrLink}
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
              {copied ? (
                <CheckIcon height={14} width={14} />
              ) : (
                <CopyIcon height={14} width={14} />
              )}
            </Button>
            <Button variant="outline" onClick={() => handleOpenWallet(qrLink)}>
              Open wallet <ArrowTopRightIcon height={14} width={14} />
            </Button>
          </>
        )}

        <Separator size="4" />
        <Text>
          <Strong>Fund transaction</Strong>
        </Text>

        <Flex direction="column" className="w-full" gap="2">
          <Flex justify="center" align="center" gap="1">
            {!isSufficientAmount && <Text>Estimated cost: </Text>}
            <Text>{formatCurrency(amountToPay.value, 18, 5)}</Text>
            <Text>{network.symbol}</Text>
            {isSufficientAmount && (
              <CheckIcon height={14} width={14} color="green" />
            )}
          </Flex>
          {!isSufficientAmount && (
            <Flex>
              <Progress value={progress} />
              <PieChartIcon height={14} width={14} className="animate-spin" />
            </Flex>
          )}
          {!isSufficientAmount && (
            <Flex justify="center" gap="1">
              <Text
                className="transition-colors duration-150"
                color={sessionBalance.loading ? "orange" : undefined}
              >
                {formatCurrency(sessionBalance.value, 18, 5)}
              </Text>
              <Text className="transition-colors duration-150">
                {network.symbol}
              </Text>
            </Flex>
          )}
          {!isSufficientAmount && (
            <Flex justify="center">
              <Text>Waiting for funds...</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </CardContent>
  );

  const FundedCardContent = (
    <CardContent className="fadeIn">
      <Flex
        direction="column"
        p="4"
        gap="2"
        className="w-full max-w-sm"
        justify="center"
        align="center"
      >
        <Text>
          <Strong>Transaction funded</Strong>
        </Text>
        <Flex direction="column" className="w-full" gap="2" pb="4">
          <Flex justify="center" align="center" gap="1">
            <Text>{formatCurrency(amountToPay.value, 18, 5)}</Text>
            <Text>{network.symbol}</Text>
            <CheckIcon height={14} width={14} color="green" />
          </Flex>
          <Flex justify="center">
            <OwnerAvatarBadge
              avatar={
                sessionOwner
                  ? `https://api.multiavatar.com/${sessionOwner}.png`
                  : undefined
              }
              avatarFallback={sessionOwner ? "0x" : "?"}
              title={sessionOwner ? shortenedOwner : "Connect"}
              description={sessionOwner ? "Owner" : "No owner"}
              CardAction={
                <>
                  <Button
                    className="cursor-pointer"
                    variant="soft"
                    onClick={() => handleOpenModifyOwner(true)}
                  >
                    {sessionOwner ? <Link2Icon /> : <LinkNone2Icon />}
                  </Button>
                  {isDesktop ? (
                    <Dialog
                      open={openModifyOwner}
                      onOpenChange={handleOpenModifyOwner}
                    >
                      <DialogContent>
                        {openModifyOwner && (
                          <ModifyOwner
                            isDesktop
                            actions={actions}
                            sessionOwner={sessionOwner}
                            sessionOwnerError={sessionOwnerError}
                            handleClose={() => handleOpenModifyOwner(false)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Drawer
                      open={openModifyOwner}
                      onOpenChange={handleOpenModifyOwner}
                    >
                      <DrawerContent>
                        {openModifyOwner && (
                          <ModifyOwner
                            actions={actions}
                            sessionOwner={sessionOwner}
                            sessionOwnerError={sessionOwnerError}
                            handleClose={() => handleOpenModifyOwner(false)}
                          />
                        )}
                      </DrawerContent>
                    </Drawer>
                  )}
                </>
              }
            />
          </Flex>
        </Flex>
        <Separator size="4" />
        <Flex
          direction="column"
          align="center"
          className="w-full"
          gap="2"
          pt="4"
        >
          <Text>
            <Strong>Redeem interval</Strong>
          </Text>
          <Text>{redeemInterval === 0 ? "Single redeem" : durationText}</Text>
          <Text>
            <Strong>Redeem amount</Strong>
          </Text>
          <Text>
            {redeemAmount} {token.symbol}
          </Text>
          <Separator size="4" />
          <Text>Anyone can top up the faucet.</Text>
          <Separator size="4" />
          <Text className="text-center">
            Only the owner can withdraw from the faucet.
          </Text>
        </Flex>
      </Flex>
    </CardContent>
  );

  const Content = (
    <Box className="w-full flex justify-center">
      <Card className="w-full max-w-sm">
        {isSufficientAmount ? FundedCardContent : FundingCardContent}
      </Card>
    </Box>
  );

  const Footer = (
    <Box
      className="w-full flex flex-col justify-center items-center gap-6"
      pt="4"
      px="4"
    >
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
          {refund.loading && (
            <PieChartIcon height={14} width={14} className="animate-spin" />
          )}
        </Button>
      )}
      {sessionOwner && isSufficientAmount && (
        <Button
          variant="soft"
          className="w-full max-w-sm"
          onClick={() => handleCreate(sessionOwner)}
        >
          Create faucet
          {createLoading && (
            <PieChartIcon height={14} width={14} className="animate-spin" />
          )}
        </Button>
      )}
    </Box>
  );

  if (isDesktop) {
    return (
      <Theme accentColor="purple" grayColor="sand" radius="large">
        <DialogHeader>
          <DialogTitle>Create {faucet.title}</DialogTitle>
          <DialogDescription>{token.name}</DialogDescription>
        </DialogHeader>
        {Content}
        <DialogFooter>{Footer}</DialogFooter>
      </Theme>
    );
  }

  return (
    <Theme accentColor="purple" grayColor="sand" radius="large">
      <DrawerHeader>
        <DrawerTitle>Create {faucet.title}</DrawerTitle>
        <DrawerDescription>{token.name}</DrawerDescription>
      </DrawerHeader>
      {Content}
      <DrawerFooter>{Footer}</DrawerFooter>
    </Theme>
  );
}
