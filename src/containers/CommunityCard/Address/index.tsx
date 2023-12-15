"use client";

import { FC, useState } from "react";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { AddressContainer, AddressText, ArrowUpIcon } from "./styles";

// function that returns the first 4 and last 4 characters of a string
function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface AddressProps {
  address: string;
  url: string;
}

const Address: FC<AddressProps> = ({ address, url }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);

    window.open(`${url}/address/${address}`, address);

    setTimeout(() => {
      setActive(false);
    }, 1500);
  };

  return (
    <AddressContainer $active={active} onClick={handleClick}>
      <AddressText $active={active}>{formatAddress(address)} </AddressText>
      <ArrowUpIcon $active={active} icon={faArrowUpRightFromSquare} />
    </AddressContainer>
  );
};

export default Address;
