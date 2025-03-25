'use server';

import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { signOut } from '@/auth';
import { auth } from '@/auth';

export async function getUserByEmailAction(args: { email: string }) {
  const { email } = args;

  const client = getServiceRoleClient();
  const { data, error } = await getUserByEmail({ client, email });

  if (error) {
    console.error(error);
    throw new Error('Could not find user by email');
  }

  return data;
}

export async function signOutAction() {
  await signOut();
}