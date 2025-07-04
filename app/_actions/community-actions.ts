'use server';

import { Config } from '@citizenwallet/sdk';
import eureGnosisCommunity from './eure_gnosis_community.json' assert { type: 'json' };
import { getAuthUserAction, getAuthUserRoleInAppAction } from './user-actions';
import { getCommunity } from '@/services/cw';
const typedEureGnosisCommunity = eureGnosisCommunity as Config;

export const fetchCommunitiesAction = async (args: {
  alias: string;
  query?: string;
}): Promise<{ communities: Config[]; total: number }> => {
  const { alias } = args;

  const { community } = await getCommunity(alias);
  const chain_id = community.community.primary_token.chain_id;

  const response = await getAuthUserAction({ chain_id });

  if (!response?.data) {
    return {
      communities: [],
      total: 0
    };
  }

  const { data: user } = response;

  if (user.role === 'admin') {
    return await fetchCommunitiesForAdminAction({
      query: args.query
    });
  }

  if (user.role === 'user') {
    const accessList = user.users_community_access.map(
      (access) => access.alias
    );

    return await fetchCommunitiesForUserAction({
      accessList,
      query: args.query
    });
  }

  return {
    communities: [],
    total: 0
  };
};

const fetchCommunitiesForUserAction = async (args: {
  accessList: string[];
  query?: string;
}): Promise<{ communities: Config[]; total: number }> => {
  const userRole = await getAuthUserRoleInAppAction();

  if (userRole !== 'user') {
    throw new Error('Unauthorized');
  }

  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }

  const { accessList, query } = args;

  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data = (await response.json()) as Config[];
  data.push(typedEureGnosisCommunity);

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

export const fetchCommunitiesForAdminAction = async (args: {
  query?: string;
}): Promise<{ communities: Config[]; total: number }> => {
  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }

  const { query } = args;

  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data = (await response.json()) as Config[];
  data.push(typedEureGnosisCommunity);
  const communities = data.filter((community) => {
    const { hidden, name, alias, description } = community.community;

    const isHidden = hidden || false;

    const isMatchName = name
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');
    const isMatchAlias = alias
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');
    const isMatchDescription = description
      .toLowerCase()
      .includes(query?.toLowerCase().trim() || '');

    return !isHidden && (isMatchName || isMatchAlias || isMatchDescription);
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
  data.push(typedEureGnosisCommunity);

  const community = data.filter((community) => {
    const { alias: aliasFromConfig } = community.community;

    const isMatchAlias = aliasFromConfig.trim() === alias.trim();

    return isMatchAlias;
  });

  if (community.length === 0) {
    throw new Error('Community not found');
  }

  return { community: community[0] };
};
