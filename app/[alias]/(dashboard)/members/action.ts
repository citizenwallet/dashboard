'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/admin-actions';
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

  const authRole = await getAuthUserRoleInCommunityAction({
    alias,
    chainId
  });

  if (!authRole) {
    throw new Error('Unauthorized');
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
