'use server';

import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { signOut } from '@/auth';
import { auth } from '@/auth';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';

export async function getAuthUserAction({ chain_id }: { chain_id: number }) {
  const session = await auth();

  if (!session?.user.chainIds?.includes(chain_id)) {
    console.error('You session does not have chain id of this community');
    return null;
  }

  if (!session?.user) {
    return null;
  }

  const { email } = session.user;

  const client = getServiceRoleClient();
  const { data, error } = await getUserByEmail({ client, email: email ?? '' });

  if (error) {
    console.error(error);
    throw new Error('Could not find user by email');
  }

  return { data, session: session.user };
}

export async function getAuthUserRoleInAppAction() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const { email } = session.user;

  const client = getServiceRoleClient();
  const { data, error } = await getUserByEmail({ client, email: email ?? '' });

  if (error) {
    console.error(error);
    throw new Error('Could not find user by email');
  }

  return data?.role;
}

export async function getAuthUserRoleInCommunityAction(args: {
  alias: string;
}) {
  const session = await auth();

  if (!session?.user) {
    return undefined;
  }

  const { email } = session.user;
  const { alias } = args;

  const client = getServiceRoleClient();
  const { data, error } = await getUserByEmail({
    client,
    email: email ?? ''
  });

  if (error) {
    console.error(error);
    throw new Error('Could not find user by email');
  }

  const role = data?.users_community_access.find(
    (access) => access.alias === alias
  )?.role;

  return role;
}

export async function signOutAction() {
  await signOut();
}
