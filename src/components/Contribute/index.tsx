"use client";
import { HorizontalSpacer } from "../base";
import { ContributeButton, ContributeLogo } from "./styles";

import GitHubSrc from "@/assets/icons/github.svg";

const Contribute = () => {
  const handleContribute = () => {
    window.open("https://github.com/citizenwallet/dashboard", "_blank");
  };

  return (
    <ContributeButton onClick={handleContribute}>
      <ContributeLogo src={GitHubSrc} alt="Github logo" />
      <HorizontalSpacer />
      Contribute
    </ContributeButton>
  );
};

export default Contribute;
