'use server';

import { getServiceRoleClient } from '@/services/db';
import { getTransfersOfToken, getTreasuryTransfersOfToken } from '@/services/db/transfers';

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


export const getTreasuryTransfersOfTokenAction = async (args: {
  chainId: number;
  tokenAddress: string;
  profileAddress: string;
  query: string;
  page: number;
  from?: string;
  to?: string;
}) => {
  const { chainId, tokenAddress, profileAddress, query, page, from, to } = args;

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


