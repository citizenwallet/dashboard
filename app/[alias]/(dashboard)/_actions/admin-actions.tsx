'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { getAdminByEmail } from '@/services/chain-db/admin';
import { signOut } from '@/auth';
import { auth } from '@/auth';

export async function getAdminByAction(args: { chainId: number }) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const { email } = session.user;

  const { chainId } = args;

  const client = getServiceRoleClient(chainId);
  const { data, error } = await getAdminByEmail({ client, email: email ?? '' });

  if (error) {
    console.error(error);
    throw new Error('Could not find admin by email');
  }

  return data;
}

export async function getAuthUserRoleInCommunityAction(args: {
  alias: string;
  chainId: number;
}) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const { email } = session.user;
  const { chainId, alias } = args;

  const client = getServiceRoleClient(chainId);
  const { data, error } = await getAdminByEmail({ client, email: email ?? '' });

  if (error) {
    console.error(error);
    throw new Error('Could not find admin by email');
  }

  const role = data?.admin_community_access.find(
    (access) => access.alias === alias
  )?.role;

  return role;
}

export async function signOutAction() {
  await signOut();
}
