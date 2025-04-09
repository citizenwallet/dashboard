'use server';

export interface Profile {
  account: string;
  description: string;
  image: string;
  image_medium: string;
  image_small: string;
  name: string;
  username: string;
}

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { pinFileToIPFS, pinJSONToIPFS } from '@/services/pinata/pinata';

export async function updateProfileImageAction(file: File, alias: string) {
  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });

  if (roleInApp != 'admin' && roleResult != 'owner') {
    throw new Error('You are not authorized to update profile image');
  }

  const result = await pinFileToIPFS(file);
  return result;
}

export async function updateProfileAction(profile: Profile, alias: string) {
  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });

  if (roleInApp != 'admin' && roleResult != 'owner') {
    throw new Error('You are not authorized to update profile image');
  }

  const result = await pinJSONToIPFS(profile);
  return result;
}
