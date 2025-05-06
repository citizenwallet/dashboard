'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { getServiceRoleClient } from '@/services/chain-db';
import { getMemberByAccount, getMembers } from '@/services/chain-db/members';
import { Config } from '@citizenwallet/sdk';

export const getMembersAction = async (args: {
  config: Config;
  query: string;
  page: number;
  showAllMembers: boolean;
}) => {
  const { config, query, page, showAllMembers } = args;

  const { chain_id: chainId, address: profileContract } =
    config.community.profile;
  const { alias } = config.community;

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias
  });

  const roleInApp = await getAuthUserRoleInAppAction();

  if (!roleInApp) {
    throw new Error('Unauthenticated user');
  }

  if (roleInApp === 'user' && !roleInCommunity) {
    throw new Error('You are not a member of this community');
  }

  const supabase = getServiceRoleClient(chainId);

  const { data, count, error } = await getMembers({
    client: supabase,
    profileContract,
    query,
    page,
    showAllMembers
  });

  if (error) {
    console.error(error);
  }

  return {
    data,
    count
  };
};

export const searchAccountAddressAction = async (args: {
  config: Config;
  address: string;
}) => {
  const { config, address } = args;

  const { chain_id: chainId, address: profileContract } =
    config.community.profile;

  const supabase = getServiceRoleClient(chainId);

  const { data, error } = await getMemberByAccount({
    client: supabase,
    profileContract,
    account: address
  });

  if (error) {
    console.error(error);
  }

  return data;
};
