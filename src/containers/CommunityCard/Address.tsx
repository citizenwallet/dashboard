"use client";

import { FC, useState } from "react";
import { AddressContainer } from "./styles";
import { copyToClipboard } from "@/utils/clipboard";

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
      {formatAddress(address)}
    </AddressContainer>
  );
};

export default Address;
