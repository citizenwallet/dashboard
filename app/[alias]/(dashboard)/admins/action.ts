'use server';

import { getServiceRoleClient } from '@/services/db';
import { getAdminsOfCommunity } from '@/services/db/admin';

export const getAdminsOfCommunityAction = async (args: { chainId: number, alias: string }) => {
  const { chainId, alias } = args;

  const supabase = getServiceRoleClient(chainId);

  const { data, count, error } = await getAdminsOfCommunity({
    alias: alias,
    client: supabase
  });

  if (error) {
    console.error(error);
  }

  return {
    data,
    count
  };
};
