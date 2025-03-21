'use server';

import { getServiceRoleClient } from '@/services/db';
import { getTransfersOfToken } from '@/services/db/transfers';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/admin-actions';
import { Config } from '@citizenwallet/sdk';

export const getTransfersOfTokenAction = async (args: {
  config: Config;
  query: string;
  page: number;
  from?: string;
  to?: string;
}) => {
  const { config, query, page, from, to } = args;
  const { alias } = config.community;
  const { chain_id: chainId, address: tokenAddress } =
    config.community.primary_token;

  const authRole = await getAuthUserRoleInCommunityAction({
    alias,
    chainId
  });

  if (!authRole) {
    throw new Error('Unauthorized');
  }

  const supabase = getServiceRoleClient(chainId);

  const { data, count, error } = await getTransfersOfToken({
    client: supabase,
    token: tokenAddress,
    query,
    page,
    from,
    to
  });

  if (error) {
    console.error(error);
  }

  return {
    data,
    count
  };
};
