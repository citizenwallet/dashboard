'use server';

import { Config } from '@citizenwallet/sdk';

export const fetchCommunitiesOfChainAction = async (args: {
  chainId: number;
  accessList: string[];
  query?: string;
}): Promise<{ communities: Config[]; total: number }> => {
  const { chainId, accessList, query } = args;

  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }

  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data = (await response.json()) as Config[];

  const communities = data.filter((community) => {
    const { primary_token, hidden, name, alias, description } =
      community.community;

    const isHidden = hidden || false;
    const isMatchChain = primary_token.chain_id === chainId;

    const isMatchAccessList = accessList.includes(alias);

    const isMatchName = name
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');
    const isMatchAlias = alias
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');
    const isMatchDescription = description
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');

    return (
      !isHidden &&
      isMatchChain &&
      (isMatchName || isMatchAlias || isMatchDescription) &&
      isMatchAccessList
    );
  });

  return { communities, total: communities.length };
};

export const fetchCommunityByAliasAction = async (
  alias: string
): Promise<{ community: Config }> => {
  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }

  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data = (await response.json()) as Config[];

  const community = data.filter((community) => {
    const { alias: aliasFromConfig } = community.community;

    const isMatchAlias = aliasFromConfig
      .toLowerCase()
      .includes(alias?.toLowerCase().trim() || '');

    return isMatchAlias;
  });

  if (community.length === 0) {
    throw new Error('Community not found');
  }

  return { community: community[0] };
};
