'use server';

import { getServiceRoleClient } from '@/services/db';
import { getMembers } from '@/services/db/members';

export const getMembersAction = async (args: {
  chainId: number;
  profile_contract: string;
  query: string;
  page: number;
}) => {
  const { chainId, profile_contract, query, page } = args;

  const supabase = getServiceRoleClient(chainId);

  const { data, count, error } = await getMembers({
    client: supabase,
    profile_contract,
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
