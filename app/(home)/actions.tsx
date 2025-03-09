'use server';

import { Config } from '@citizenwallet/sdk';

export const fetchCommunitiesOfChainAction = async (
  chainId: number,
  query?: string
): Promise<{ communities: Config[]; total: number }> => {
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

    const isMatchName = name.toLowerCase().includes(query?.toLowerCase().trim() || '');
    const isMatchAlias = alias
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');
    const isMatchDescription = description
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');

    return (
      !isHidden &&
      isMatchChain &&
      (isMatchName || isMatchAlias || isMatchDescription)
    );
  });

  return { communities, total: communities.length };
};
