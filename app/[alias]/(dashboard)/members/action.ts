'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { getAuthUserRoleInCommunityAction } from '@/app/[alias]/(dashboard)/_actions/admin-actions';
import { getAuthUserRoleInAppAction } from '@/app/(home)/_actions/user-actions';
import { getMembers } from '@/services/chain-db/members';
import { Config } from '@citizenwallet/sdk';

export const getMembersAction = async (args: {
  config: Config;
  query: string;
  page: number;
}) => {
  const { config, query, page } = args;

  const { chain_id: chainId, address: profileContract } =
    config.community.profile;
  const { alias } = config.community;

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias,
    chainId
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
    page
  });

  if (error) {
    console.error(error);
  }

  return {
    data,
    count
  };
};
