import { Config } from "@/services/config";
import {
  Card,
  CardTitle,
  CardTitleRow,
  ChainLogo,
  CommunityBalance,
  CommunityBalanceRow,
  CommunityLogo,
} from "./styles";
import { FC } from "react";
import CommunityLogic from "@/state/community/logic";
import Address from "./Address";
import { HorizontalSpacer, VerticalSpacer } from "@/components/base";

import polygonIcon from "@/assets/icons/polygon.jpg";
import celoIcon from "@/assets/icons/celo.jpg";
import baseIcon from "@/assets/icons/base.jpg";
import { StaticImageData } from "next/image";

const CHAIN_ICONS: { [key: number]: StaticImageData } = {
  137: polygonIcon,
  42220: celoIcon,
  8453: baseIcon,
};

interface CommunityCardProps {
  config: Config;
  children?: React.ReactNode;
}

const CommunityCard: FC<CommunityCardProps> = async ({
  config: { community, node, erc4337, token },
}: CommunityCardProps) => {
  const communityLogic = new CommunityLogic(
    node.url,
    token.address,
    erc4337.paymaster_address ?? ""
  );

  const address = await communityLogic.fetchSponsorAddress();

  const chainInfo = await communityLogic.fetchChainInfo();

  const balance = await communityLogic.fetchBalance(address);

  const icon = CHAIN_ICONS[chainInfo.chainId];

  return (
    <Card>
      {!!icon && (
        <ChainLogo
          src={icon}
          alt={`${chainInfo.shortName} logo`}
          height={20}
          width={20}
        />
      )}
      <CardTitleRow>
        <CommunityLogo
          src={community.logo}
          alt={`${community.name} Logo`}
          width={40}
          height={40}
        />
        <HorizontalSpacer />
        <CardTitle>{community.name}</CardTitle>
      </CardTitleRow>
      <VerticalSpacer />
      <Address address={address} />
      <VerticalSpacer />
      <CommunityBalanceRow>
        <CommunityBalance>
          Balance: {balance} {chainInfo.nativeCurrency.symbol}
        </CommunityBalance>
      </CommunityBalanceRow>
    </Card>
  );
};

export default CommunityCard;
