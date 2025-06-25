'use server';

import { getServiceRoleClient } from '@/services/top-db';
import {
  getCommunities,
  getCommunityByAlias
} from '@/services/top-db/community';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { getAuthUserAction, getAuthUserRoleInAppAction } from './user-actions';

export const fetchCommunitiesAction = async (args: {
  alias: string;
  query?: string;
  page?: number;
}): Promise<{ communities: Config[]; total: number }> => {
  const { alias } = args;

  const client = getServiceRoleClient();

  const { data: communityRow, error } = await getCommunityByAlias(
    client,
    alias
  );
  if (error || !communityRow) {
    throw new Error('Community not found');
  }

  const community = new CommunityConfig(communityRow.json);

  // TODO: this will create a conflict with the new PR
  const chain_id = community.primaryToken.chain_id;

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
      query: args.query,
      page: args.page
    });
  }

  if (user.role === 'user') {
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

  const { data, count } = await getCommunities(client, query, page);

  if (!data || data.length < 1) {
    return {
      communities: [],
      total: 0
    };
  }

  const communitieData = data?.filter((data) =>
    accessList.includes(data.alias)
  );
  const communities = communitieData?.map((data) => data.json);

  if (!communities) {
    return { communities: [], total: 0 };
  }

  return { communities, total: count ?? 0 };
};

export const fetchCommunitiesForAdminAction = async (args: {
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

  if (!datas || datas.length < 1) {
    return {
      communities: [],
      total: 0
    };
  }

  const communities = datas?.map((data) => data?.json);

  return { communities, total: count ?? 0 };
};
