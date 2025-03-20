'use server';

import { getServiceRoleClient } from '@/services/db';
import { searchMembers } from '@/services/db/members';

export const searchMemberToMint = async (args: {
  chainId: number;
  profileContract: string;
  query: string;
}) => {

  const { chainId, profileContract, query } = args;
  const supabase = getServiceRoleClient(chainId);

  console.log('searching', query);
  const { data, error } = await searchMembers({
    client: supabase,
    profileContract,
    query
  });

  if (error) {
    console.error(error);
  }

  return data ?? []
};
