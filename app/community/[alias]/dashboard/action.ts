'use server';


import { Config  } from '@citizenwallet/sdk';

export async function getCommunities() {
  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }

  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data = await response.json();
  return data;
}

export async function getCommunity(alias: string) {
  const communities = await getCommunities();

  const community = communities.find(
    (community: Config) => 
      community.community?.alias === alias || community.community?.alias.includes(alias)
  );

  if (!community) {
    throw new Error(`Community with alias ${alias} not found`);
  }

  return community;
}