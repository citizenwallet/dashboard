"use client";

import HomeTemplate from "@/templates/Home";
import { shortenAddress } from "@/utils/shortenAddress";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";

interface ContainerProps {
  hash: string;
  appBaseUrl: string;
  appDeepLink: string;
}

export default function Container({
  hash,
  appBaseUrl,
  appDeepLink,
}: ContainerProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [copied, setCopied] = useState(false);

  const faucetDeepLink = `?dl=community&community=${hash}`;

  const qrLink = `${appBaseUrl}${faucetDeepLink}`;

  console.log("qrLink", qrLink);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  };

  const handleOpenApp = () => {
    const link = `${appDeepLink}/#/${faucetDeepLink}`;
    window.open(link);
  };

  return (
    <HomeTemplate
      QRCode={
        <Box className="p-4 border rounded-lg bg-white">
          <Text>Import Community </Text>
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
              onClick={() => handleCopy(qrLink)}
            >
              {shortenAddress(hash)}{" "}
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
      }
    />
  );
}
