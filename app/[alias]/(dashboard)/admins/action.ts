'use server';

import { getAuthUserRoleInCommunityAction } from '@/app/[alias]/(dashboard)/_actions/admin-actions';
import { getServiceRoleClient as getChainDbClient } from '@/services/chain-db';
import { getServiceRoleClient as getTopDbClient } from '@/services/top-db';
import {
  getAdminsOfCommunity,
  removeAdminFromCommunity as removeAdminFromCommunityChainDb
} from '@/services/chain-db/admin';
import { removeUserFromCommunity as removeUserFromCommunityTopDb } from '@/services/top-db/users';
import { revalidatePath } from 'next/cache';

export const getAdminsOfCommunityAction = async (args: {
  chainId: number;
  alias: string;
}) => {
  const { chainId, alias } = args;

  const authRole = await getAuthUserRoleInCommunityAction({
    alias: alias,
    chainId: chainId
  });

  if (!authRole) {
    throw new Error('Unauthorized');
  }

  const supabase = getChainDbClient(chainId);
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
  adminEmail: string;
  alias: string;
  chainId: number;
}) {
  const { adminIdToRemove, alias, chainId, adminEmail } = args;

  const authRole = await getAuthUserRoleInCommunityAction({
    alias: args.alias,
    chainId: args.chainId
  });

  if (authRole !== 'owner') {
    throw new Error('Unauthorized');
  }

  const chainDbClient = getChainDbClient(chainId);
  const topDbClient = getTopDbClient();

  const { error } = await removeAdminFromCommunityChainDb({
    client: chainDbClient,
    data: {
      admin_id: adminIdToRemove,
      alias
    }
  });

  const { error: removeUserError } = await removeUserFromCommunityTopDb({
    client: topDbClient,
    data: {
      alias,
      email: adminEmail
    }
  });

  if (error || removeUserError) {
    console.error(error);
    console.error(removeUserError);
    throw new Error('Could not remove admin from community');
  }

  revalidatePath(`/${alias}/admins`, 'page');
}
