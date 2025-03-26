'use server';

import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { signOut } from '@/auth';
import { auth } from '@/auth';

export async function getAuthUserAction() {
  const session = await auth(); 

  if (!session?.user) {
    throw new Error('Unauthorized');
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
    throw new Error('Unauthorized');
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





export async function signOutAction() {
  await signOut();
}
