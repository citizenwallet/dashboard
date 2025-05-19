'use server';

import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { signOut } from '@/auth';
import { auth } from '@/auth';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';

export async function getAuthUserAction({ alias }: { alias: string }) {
  const session = await auth();
  const { community: config } = await fetchCommunityByAliasAction(alias);
  const chain_id = config.community.primary_token.chain_id.toString();
  console.log('session--->', session?.user);

  if (!session?.user.chainIds?.includes(chain_id)) {
    console.error('You are not authorized to access this community');
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

  return data;
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
