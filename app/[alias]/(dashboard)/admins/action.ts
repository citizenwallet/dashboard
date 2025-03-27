'use server';

import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import { getServiceRoleClient as getTopDbClient } from '@/services/top-db';
import {
  getUsersOfCommunity,
  removeUserFromCommunity
} from '@/services/top-db/users';
import { revalidatePath } from 'next/cache';
import { getAuthUserRoleInAppAction } from '@/app/_actions/user-actions';

export const getUsersOfCommunityAction = async (args: { alias: string }) => {
  const { alias } = args;

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

  const supabase = getTopDbClient();

  const { data, count, error } = await getUsersOfCommunity({
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

export async function removeUserFromCommunityAction(args: {
  userIdToRemove: number;
  alias: string;
}) {
  const { userIdToRemove, alias } = args;

  const authRole = await getAuthUserRoleInCommunityAction({
    alias
  });

  if (authRole !== 'owner') {
    throw new Error('Unauthorized');
  }

  const topDbClient = getTopDbClient();

  const { error } = await removeUserFromCommunity({
    client: topDbClient,
    data: {
      user_id: userIdToRemove,
      alias
    }
  });

  if (error) {
    console.error(error);
    throw new Error('Could not remove user from community');
  }

  revalidatePath(`/${alias}/admins`, 'page');
}
