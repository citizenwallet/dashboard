
'use server';
import { Config,LogsService,CommunityConfig,tokenTransferEventTopic  } from '@citizenwallet/sdk';

export async function getCommunities() {
    if (!process.env.COMMUNITIES_CONFIG_URL) {
      throw new Error('COMMUNITIES_CONFIG_URL is not set');
    }
  
    const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
    const data = await response.json();
    return data;
  }
  
  export async function getCommunity(alias: string): Promise<Config> {
    const communities = await getCommunities();
  
    const community = communities.find(
      (community: Config) => 
        community.community?.alias === alias || community.community?.alias.includes(alias)
    );
    return community;
  }
  
  
  export async function getTransactions(alias: string,page:number) {
    const community = await getCommunity(alias);
    const communityConfig = new CommunityConfig(community);
    const logsService = new LogsService(communityConfig);
    
    const tokenAddress = community.community.primary_token.address;
    const transactions = await logsService.getAllLogs(
      tokenAddress,
      tokenTransferEventTopic,
      {
        limit: 10,
        offset: (page-1)*10,
        maxDate: new Date().toISOString()
      }
    );
    
    return transactions;
  }
  