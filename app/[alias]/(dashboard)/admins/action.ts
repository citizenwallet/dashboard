'use server';

import { getServiceRoleClient } from '@/services/db';
import { getAdmins } from '@/services/db/admin';

export const getAdminsAction = async (args: { chainId: number }) => {
  const { chainId } = args;

  const supabase = getServiceRoleClient(chainId);

  const { data, count, error } = await getAdmins({
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
