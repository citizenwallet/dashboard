'use server';

import { getServiceRoleClient } from '@/services/top-db';
import {
  getCommunities,
  getCommunityByAlias,
  getCommunityByAliasList
} from '@/services/top-db/community';
import { Config } from '@citizenwallet/sdk';
import { getAuthUserAction, getAuthUserRoleInAppAction } from './user-actions';

export const fetchCommunitiesAction = async (args: {
  query?: string;
  page?: number;
}): Promise<{ communities: Config[]; total: number }> => {
  const user = await getAuthUserAction();

  if (!user) {
    return {
      communities: [],
      total: 0
    };
  }

  const { role } = user;

  if (role === 'admin') {
    return await fetchCommunitiesForAdminAction({
      query: args.query,
      page: args.page
    });
  }

  if (role === 'user') {
    const accessList = user.users_community_access.map(
      (access) => access.alias
    );

    return await fetchCommunitiesForUserAction({
      accessList,
      query: args.query,
      page: args.page
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
  page?: number;
}): Promise<{ communities: Config[]; total: number }> => {
  const userRole = await getAuthUserRoleInAppAction();

  if (userRole !== 'user') {
    throw new Error('Unauthorized');
  }

  const { accessList, query, page } = args;

  const client = getServiceRoleClient();
  const { data, count } = await getCommunityByAliasList(
    client,
    accessList,
    query,
    page
  );

  const communities = data?.map((data) => data?.json);

  if (!communities) {
    return { communities: [], total: 0 };
  }

  return { communities, total: count ?? 0 };
};

const fetchCommunitiesForAdminAction = async (args: {
  query?: string;
  page?: number;
}): Promise<{ communities: Config[]; total: number }> => {
  const userRole = await getAuthUserRoleInAppAction();

  if (userRole !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { query, page } = args;

  const client = getServiceRoleClient();
  const { data: datas, count } = await getCommunities(client, query, page);

  if (!datas && !count) {
    return {
      communities: [],
      total: 0
    };
  }

  const communities = datas?.map((data) => data?.json);

  return { communities, total: count ?? 0 };
};

export const fetchCommunityByAliasAction = async (
  alias: string
): Promise<{ community: Config }> => {
  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Community not found');
  }

  return { community: data?.json };
};
