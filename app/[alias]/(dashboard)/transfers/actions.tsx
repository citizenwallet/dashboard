'use server';

import { getServiceRoleClient } from '@/services/db';
import { getTransfersOfToken } from '@/services/db/transfers';

export const getTransfersOfTokenAction = async (args: {
  chainId: number;
  tokenAddress: string;
  query: string;
  page: number;
  from?: string;
  to?: string;
}) => {
  const { chainId, tokenAddress, query, page, from, to } = args;

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
