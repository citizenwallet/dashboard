'use server';

import { revalidatePath } from 'next/cache';

import {
  Config,
  LogsService,
  CommunityConfig,
  tokenTransferEventTopic
} from '@citizenwallet/sdk';
// import { createClient } from '@supabase/supabase-js';

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
      community.community?.alias === alias ||
      community.community?.alias.includes(alias)
  );
  return community;
}

export async function getCommunitychainid(alias: string) {
  const communities = await getCommunities();

  const community = await getCommunity(alias);
  const chainId = community.community.profile.chain_id;
  return chainId;
}

export async function getCommunity_supabaseclient(alias: string) {
  const communities = await getCommunities();

  const community = await getCommunity(alias);
  const chainId = community.community.profile.chain_id;
  const supabaseUrl = process.env[`SUPABASE_${chainId}_URL`];
  return supabaseUrl;

  // const supabaseUrl = process.env[`SUPABASE_${chainId}_URL`];
  // const supabaseKey = process.env[`SUPABASE_${chainId}_ANON_KEY`];

  // return createClient(supabaseUrl, supabaseKey);
}

export async function getTransactions(alias: string, page: number) {
  const community = await getCommunity(alias);
  const communityConfig = new CommunityConfig(community);
  const logsService = new LogsService(communityConfig);

  const tokenAddress = community.community.primary_token.address;
  const transactions = await logsService.getAllLogs(
    tokenAddress,
    tokenTransferEventTopic,
    {
      limit: 10,
      offset: (page - 1) * 10,
      maxDate: new Date().toISOString()
    }
  );

  return transactions;
}
