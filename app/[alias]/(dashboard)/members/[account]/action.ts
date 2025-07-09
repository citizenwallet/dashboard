'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { MemberT } from '@/services/chain-db/members';
import { pinFileToIPFS, pinJSONToIPFS } from '@/services/pinata/pinata';

export type Profile = Pick<
  MemberT,
  | 'account'
  | 'description'
  | 'image'
  | 'image_medium'
  | 'image_small'
  | 'name'
  | 'username'
>;

export async function updateProfileImageAction(file: File, alias: string) {
  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });

  if (roleInApp != 'admin' && roleResult != 'owner') {
    throw new Error('You are not authorized to update profile image');
  }

  const result = await pinFileToIPFS(file);
  return result;
}

export async function pinJsonToIPFSAction(Profile: Profile) {
  try {
    const result = await pinJSONToIPFS(Profile);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to pin JSON to IPFS');
  }
}
