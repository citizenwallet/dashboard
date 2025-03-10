import { Config, CommunityConfig } from '@citizenwallet/sdk';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { getTransfersOfTokenAction } from '../actions';

interface TransferTableProps {
  query: string;
  page: number;
  alias: string;
}

export default async function TransferTable({
  query,
  page,
  alias
}: TransferTableProps) {
  let community: Config | null = null;

  try {
    const result = await fetchCommunityByAliasAction(alias);
    community = result.community;
  } catch (error) {
    console.error(error);
  }

  if (!community) {
    return <div>Community not found</div>;
  }
    
    const communityConfig = new CommunityConfig(community);
    const primaryToken = communityConfig.primaryToken;

    const {data, count: totalCount} = await getTransfersOfTokenAction({
        chainId: primaryToken.chain_id,
        tokenAddress: primaryToken.address,
        query,
        page
    });

    // console.log(data);
    console.log('totalCount',totalCount);
    


    
    
    

    return <div>Transfers</div>;
    
}
