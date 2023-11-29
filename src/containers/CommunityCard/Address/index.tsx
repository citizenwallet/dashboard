"use client";

import { FC, useState } from "react";
import { copyToClipboard } from "@/utils/clipboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { AddressContainer, AddressText, CopyIcon } from "./styles";

// function that returns the first 4 and last 4 characters of a string
function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface AddressProps {
  address: string;
}

const Address: FC<AddressProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    setCopied(true);
    copyToClipboard(address);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <AddressContainer $copied={copied} onClick={handleClick}>
      <AddressText $copied={copied}>{formatAddress(address)} </AddressText>
      <CopyIcon $copied={copied} icon={faCopy} />
    </AddressContainer>
  );
};

export default Address;
