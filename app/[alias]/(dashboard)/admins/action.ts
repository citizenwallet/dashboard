'use server';

import { getAuthUserRoleInCommunityAction } from '@/app/_actions/admin-actions';
import { getServiceRoleClient } from '@/services/db';
import {
  getAdminsOfCommunity,
  removeAdminFromCommunity
} from '@/services/db/admin';
import { revalidatePath } from 'next/cache';

export const getAdminsOfCommunityAction = async (args: {
  chainId: number;
  alias: string;
}) => {
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

export async function removeAdminFromCommunityAction(args: {
  adminIdToRemove: number;
  alias: string;
  chainId: number;
}) {
  const { adminIdToRemove, alias, chainId } = args;

  const authRole = await getAuthUserRoleInCommunityAction({
    alias: args.alias,
    chainId: args.chainId
  });

  if (authRole !== 'owner') {
    throw new Error('Unauthorized');
  }

  const client = getServiceRoleClient(chainId);

  const { error } = await removeAdminFromCommunity({
    client,
    data: {
      admin_id: adminIdToRemove,
      alias
    }
  });

  if (error) {
    console.error(error);
    throw new Error('Could not remove admin from community');
  }

  revalidatePath(`/${alias}/admins`, 'page');
}
