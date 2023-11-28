import { Config } from "@/services/config";
import { Card } from "./styles";
import { FC } from "react";
import CommunityLogic from "@/state/community/logic";
import Address from "./Address";

interface CommunityCardProps {
  config: Config;
  children?: React.ReactNode;
}

const CommunityCard: FC<CommunityCardProps> = async ({
  config,
}: CommunityCardProps) => {
  const communityLogic = new CommunityLogic(
    config.node.url,
    config.token.address,
    config.erc4337.paymaster_address ?? ""
  );

  const address = await communityLogic.fetchSponsorAddress();

  const balance = await communityLogic.fetchBalance(address);

  return (
    <Card>
      <div>{config.community.name}</div>
      <Address address={address} />
      <div>balance: {balance}</div>
    </Card>
  );
};

export default CommunityCard;
