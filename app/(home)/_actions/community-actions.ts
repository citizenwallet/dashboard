'use server';

import { Config } from '@citizenwallet/sdk';

export const fetchCommunitiesAction = async (args: {
  accessList: string[];
  query?: string;
}): Promise<{ communities: Config[]; total: number }> => {
  const { accessList, query } = args;

  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }

  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data = (await response.json()) as Config[];

  const communities = data.filter((community) => {
    const { hidden, name, alias, description } = community.community;

    const isHidden = hidden || false;

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
      (isMatchName || isMatchAlias || isMatchDescription) &&
      isMatchAccessList
    );
  });

  return { communities, total: communities.length };
};
