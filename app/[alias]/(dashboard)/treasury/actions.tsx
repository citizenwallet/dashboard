'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { getTreasuryTransfersOfToken } from '@/services/chain-db/transfers';
import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { Config } from '@citizenwallet/sdk';

export const getTreasuryTransfersOfTokenAction = async (args: {
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
  const { address: profileAddress } = config.community.profile;

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

  const { data, count, error } = await getTreasuryTransfersOfToken({
    client: supabase,
    token: tokenAddress,
    profile: profileAddress,
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
