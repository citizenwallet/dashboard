'use server';

import { getServiceRoleClient } from '@/services/db';
import { getAdminByEmail } from '@/services/db/admin';
import { signOut } from '@/auth';

export async function getAdminByEmailAction(args: {
  email: string;
  chainId: number;
}) {
  const { email, chainId } = args;

  const client = getServiceRoleClient(chainId);
  const { data, error } = await getAdminByEmail({ client, email });

  if (error) {
    console.error(error);
    throw new Error('Could not find admin by email');
  }

  return data;
}

export async function signOutAction() {
  await signOut();
}
