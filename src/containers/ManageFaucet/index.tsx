"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Config,
  NETWORKS,
  useContract,
  useERC20,
  useScrollableElementFetcher,
  useSimpleFaucetContract,
} from "@citizenwallet/sdk";
import { UploadIcon, CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { Avatar, Box, Button, Flex, Separator, Text } from "@radix-ui/themes";
import InfoPageTemplate from "@/templates/InfoPage";
import ManageFaucetTemplate from "@/templates/ManageFaucet";
import TransferCard from "@/components/TransferCard";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { generateEIP681Link } from "@/utils/eip681Link";
import { useSafeEffect } from "@/hooks/useSafeEffect";
import { shortenAddress } from "@/utils/shortenAddress";
import Image from "next/image";
import MissingIcon from "@/assets/icons/missing.svg";
import { formatCurrency } from "@/utils/formatCurrency";
import { readableDuration } from "@/utils/duration";

// http://localhost:3000/faucet/gratitude/0x48a5c3e5756bEA469d466932CF4A9fa735B689c5

export default function Container({
  config,
  faucetAddress,
}: {
  config: Config;
  faucetAddress: string;
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

  const handleWithdraw = () => {
    const link = `${config.scan.url}/address/${faucetAddress}#writeContract`;

    window.open(link, link);
  };

  const network = NETWORKS[config.node.chain_id];

  const [subscribe, actions] = useERC20(network);
  const [faucetSubscribe, faucetActions] = useSimpleFaucetContract(
    faucetAddress,
    config,
    faucetAddress
  );

  useSafeEffect(() => {
    actions.getBalance(faucetAddress);
    faucetActions.fetchMetadata();

    actions.listenForTransfers(faucetAddress, 2000);

    return () => {
      actions.stopListeners(faucetAddress);
    };
  }, [faucetAddress, actions]);

  const scrollRef = useScrollableElementFetcher(() =>
    actions.getTransfers(faucetAddress)
  );

  const [contractSubscribe, contractActions] = useContract(config);

  useEffect(() => {
    contractActions.checkExists(faucetAddress);
  }, [contractActions, faucetAddress]);

  const exists = contractSubscribe((state) => state.exists);
  const loading = contractSubscribe((state) => state.loading);

  const metadataLoading = faucetSubscribe((state) => state.metadataLoading);
  const metadata = faucetSubscribe((state) => state.metadata);

  const balance = subscribe((state) => state.balance);
  const transfers = subscribe((state) => state.transfers);

  const { community, node, token } = config;

  const qrLink = generateEIP681Link({
    address: faucetAddress,
    chainId: node.chain_id,
  });

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
    <ManageFaucetTemplate
      scrollRef={scrollRef}
      FaucetCard={
        !loading &&
        exists && (
          <Box className="flex flex-col align-center gap-2 p-4 border rounded-lg bg-white">
            <Flex justify="between" align="center" gap="2">
              <Avatar
                src={community.logo}
                fallback={token.symbol}
                color="gray"
                radius="full"
              />
              <Text size="5">{token.name}</Text>
            </Flex>
            <Box className="p-4 border rounded-lg bg-white">
              <Text>Faucet</Text>
              <QRCode
                size={256}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
                className="animate-fadeIn"
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
                <Button variant="outline" onClick={handleWithdraw}>
                  Withdraw <UploadIcon height={14} width={14} />
                </Button>
              </Flex>
            </Box>
            <Flex align="center" gap="2">
              <Text>Balance: </Text>
              {!balance.loading ? (
                <Text>{formatCurrency(balance.value, token.decimals, 2)}</Text>
              ) : (
                <Skeleton
                  style={{ height: 24, width: 40 }}
                  className="w-full"
                />
              )}
              <Text>{token.symbol}</Text>
            </Flex>
            <Separator size="4" />
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
      FaucetTransfersHeading={
        <Box className="z-50 sticky top-0 left-0 bg-white py-4 flex flex-row justify-between align-center">
          <Text>Transactions</Text>
        </Box>
      }
      FaucetTransfers={
        <>
          {(!transfers.loading || transfers.transfers.length > 0) &&
            transfers.transfers.map((tx, i) => (
              <TransferCard
                key={tx.tx_hash}
                account={faucetAddress}
                transfer={tx}
                token={token}
              />
            ))}
          {transfers.loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} style={{ height: 64 }} />
            ))}
        </>
      }
    />
  );
}
