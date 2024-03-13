"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Config,
  useContract,
  useSimpleFaucetContract,
} from "@citizenwallet/sdk";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { Avatar, Box, Button, Flex, Text } from "@radix-ui/themes";
import InfoPageTemplate from "@/templates/InfoPage";
import RedeemFaucetTemplate from "@/templates/RedeemFaucet";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useSafeEffect } from "@/hooks/useSafeEffect";
import { shortenAddress } from "@/utils/shortenAddress";
import Image from "next/image";
import MissingIcon from "@/assets/icons/missing.svg";
import { readableDuration } from "@/utils/duration";
import { ArrowUpRight } from "lucide-react";

// http://localhost:3000/faucet/gratitude/0x48a5c3e5756bEA469d466932CF4A9fa735B689c5

export default function Container({
  config,
  faucetAddress,
  appBaseUrl,
  appDeepLink,
}: {
  config: Config;
  faucetAddress: string;
  appBaseUrl: string;
  appDeepLink: string;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [copied, setCopied] = useState(false);

  const redeemTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [redeemCopied, setRedeemCopied] = useState(false);

  useSafeEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(redeemTimeoutRef.current);
    };
  }, []);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCopyRedeemLink = () => {
    const protocol = window.location.protocol;
    const baseUrl = window.location.hostname;
    const link = `${protocol}//${baseUrl}/redeem/faucet/${faucetAddress}`;
    navigator.clipboard.writeText(link);

    setRedeemCopied(true);

    redeemTimeoutRef.current = setTimeout(() => {
      setRedeemCopied(false);
    }, 2000);
  };

  const [faucetSubscribe, faucetActions] = useSimpleFaucetContract(
    faucetAddress,
    config,
    faucetAddress
  );

  useSafeEffect(() => {
    faucetActions.fetchMetadata();
  }, [faucetAddress]);

  const [contractSubscribe, contractActions] = useContract(config);

  useEffect(() => {
    contractActions.checkExists(faucetAddress);
  }, [contractActions, faucetAddress]);

  const exists = contractSubscribe((state) => state.exists);
  const loading = contractSubscribe((state) => state.loading);

  const metadataLoading = faucetSubscribe((state) => state.metadataLoading);
  const metadata = faucetSubscribe((state) => state.metadata);

  const { community, token } = config;

  const deepLinkParams = encodeURIComponent(
    `alias=${community.alias}&address=${faucetAddress}`
  );
  const faucetDeepLink = `?dl=faucet-v1&faucet-v1=${deepLinkParams}`;

  const qrLink = `${appBaseUrl}${faucetDeepLink}`;

  const handleOpenApp = () => {
    const link = `${appDeepLink}/#/${faucetDeepLink}`;
    window.open(link);
  };

  if (!loading && !exists) {
    return (
      <InfoPageTemplate
        description="Faucet not found"
        Content={
          <Image
            src={MissingIcon}
            alt="faucet not found icon"
            height={200}
            width={200}
          />
        }
      />
    );
  }

  return (
    <RedeemFaucetTemplate
      FaucetCard={
        !loading &&
        exists && (
          <Box className="w-[330px] flex flex-col align-center gap-2 p-4 border rounded-lg bg-white">
            <Text weight="bold" size="5">
              Faucet
            </Text>
            <Flex justify="between" align="center" gap="2">
              <Avatar
                src={community.logo}
                fallback={token.symbol}
                color="gray"
                radius="full"
              />
              <Text className="truncate" size="5">
                {token.name}
              </Text>
            </Flex>
            <Box className="p-4 border rounded-lg bg-white">
              <Text>Redeem </Text>
              <QRCode
                size={256}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
                className="animate-fadeIn p-1"
                value={qrLink}
                viewBox={`0 0 256 256`}
              />
              <Flex justify="between" align="center" pt="2">
                <Button
                  variant="outline"
                  color="gray"
                  onClick={() => handleCopy(faucetAddress)}
                >
                  {shortenAddress(faucetAddress)}{" "}
                  {copied ? (
                    <CheckIcon height={14} width={14} />
                  ) : (
                    <CopyIcon height={14} width={14} />
                  )}
                </Button>
                <Button variant="outline" onClick={handleOpenApp}>
                  Open App <ArrowUpRight height={14} width={14} />
                </Button>
              </Flex>
            </Box>
            <Flex align="center" gap="2">
              <Text>Redeem interval: </Text>
              {!metadataLoading ? (
                <Text>
                  {metadata.redeemInterval === 0
                    ? "Once"
                    : readableDuration(metadata.redeemInterval)}
                </Text>
              ) : (
                <Skeleton
                  style={{ height: 24, width: 40 }}
                  className="w-full"
                />
              )}
            </Flex>
            <Flex align="center" gap="2">
              <Text>Redeem amount: </Text>
              {!metadataLoading ? (
                <Text>
                  {metadata.amount} {token.symbol}
                </Text>
              ) : (
                <Skeleton
                  style={{ height: 24, width: 40 }}
                  className="w-full"
                />
              )}
            </Flex>
            <Flex justify="end" align="center" gap="2" pt="2">
              <Button variant="soft" onClick={handleCopyRedeemLink}>
                Copy redeem link{" "}
                {redeemCopied ? (
                  <CheckIcon height={14} width={14} />
                ) : (
                  <CopyIcon height={14} width={14} />
                )}
              </Button>
            </Flex>
          </Box>
        )
      }
    />
  );
}
