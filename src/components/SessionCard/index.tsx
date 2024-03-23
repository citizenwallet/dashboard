import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateProgress } from "@/utils/calculateProgress";
import { generateEIP681Link } from "@/utils/eip681Link";
import { formatCurrency } from "@/utils/formatCurrency";
import { shortenAddress } from "@/utils/shortenAddress";
import { CheckoutActions, Network, useSafeEffect } from "@citizenwallet/sdk";
import ModifyOwner from "./ModifyOwner";
import {
  ArrowTopRightIcon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  LinkNone2Icon,
  PieChartIcon,
} from "@radix-ui/react-icons";
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
import { Box, Button, Flex, Separator, Strong, Text } from "@radix-ui/themes";
import { useRef, useState } from "react";
import OwnerAvatarBadge from "@/components/OwnerAvatarBadge";

import QRCode from "react-qr-code";

interface ComponentProps {
  isDesktop: boolean;
  fundingItemName: string;
  network: Network;
  sessionAddress: {
    loading: boolean;
    value: string;
  };
  amountToPay: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  sessionBalance: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  sessionOwner: string | undefined;
  sessionOwnerError: boolean;
  actions: CheckoutActions;
  AdditionalInfo?: React.ReactNode;
  onValidityChange?: (valid: boolean) => void;
  onCheckout?: () => void;
  onCancel?: () => void;
  isCheckingOut?: boolean;
  isRefunding?: boolean;
}

export default function Component({
  isDesktop,
  fundingItemName,
  network,
  sessionAddress,
  amountToPay,
  sessionBalance,
  sessionOwner,
  sessionOwnerError,
  actions,
  AdditionalInfo,
  onValidityChange,
  onCheckout,
  onCancel,
  isCheckingOut,
  isRefunding,
}: ComponentProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [copied, setCopied] = useState(false);

  const [openModifyOwner, setOpenModifyOwner] = useState(false);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useSafeEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleOpenWallet = (url: string) => {
    window.open(url, "_blank");
  };

  const handleOpenModifyOwner = (opened: boolean) => {
    setOpenModifyOwner(opened);
  };

  const shortenedOwner = shortenAddress(sessionOwner);

  const progress = calculateProgress(
    Number(sessionBalance.value),
    Number(amountToPay.value)
  );

  const qrLink = generateEIP681Link({
    address: sessionAddress.value,
    chainId: network.chainId,
    amount: Math.max(Number(amountToPay.value - sessionBalance.value), 0),
  });

  const isSufficientAmount = progress >= 100;

  useSafeEffect(() => {
    if (onValidityChange) {
      onValidityChange(isSufficientAmount && sessionOwner !== undefined);
    }
  }, [onValidityChange, isSufficientAmount, sessionOwner]);

  if (!isSufficientAmount) {
    return (
      <Box className="w-full flex justify-center">
        <Card className="w-full max-w-sm">
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
                Send <Strong>{network.symbol}</Strong> to the following address
                to fund {fundingItemName}.
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
                  <Button
                    variant="outline"
                    onClick={() => handleOpenWallet(qrLink)}
                  >
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
                    <PieChartIcon
                      height={14}
                      width={14}
                      className="animate-spin"
                    />
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
        </Card>
      </Box>
    );
  }

  return (
    <Box className="w-full flex justify-center">
      <Card className="w-full max-w-sm">
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
            {AdditionalInfo && <Separator size="4" />}
            {AdditionalInfo}
          </Flex>
        </CardContent>
        {(onCheckout || onCancel) && (
          <CardFooter>
            <Flex
              width="100%"
              direction="column"
              justify="center"
              align="center"
              gap="4"
            >
              {onCancel && (
                <Button
                  variant="outline"
                  color="orange"
                  onClick={isRefunding ? undefined : onCancel}
                >
                  Cancel & Refund{" "}
                  {isRefunding && (
                    <PieChartIcon
                      height={14}
                      width={14}
                      className="animate-spin"
                    />
                  )}
                </Button>
              )}
              {onCheckout && (
                <Button
                  variant="soft"
                  onClick={isCheckingOut ? undefined : onCheckout}
                >
                  Configure Community{" "}
                  {isCheckingOut && (
                    <PieChartIcon
                      height={14}
                      width={14}
                      className="animate-spin"
                    />
                  )}
                </Button>
              )}
            </Flex>
          </CardFooter>
        )}
      </Card>
    </Box>
  );
}
