'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { getServiceRoleClient } from '@/services/chain-db';
import {
  MemberT,
  removeMember,
  updateMember
} from '@/services/chain-db/members';
import { pinFileToIPFS, pinJSONToIPFS, unpin } from '@/services/pinata/pinata';
import { Config } from '@citizenwallet/sdk';
import { revalidatePath } from 'next/cache';

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

function convertIpfsUrl(ipfsUrl: string) {
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace(
      'ipfs://',
      'https://ipfs.internal.citizenwallet.xyz/'
    );
  }
  return ipfsUrl;
}

export async function updateProfileImageAction(file: File, alias: string) {
  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });

  if (roleInApp != 'admin' && roleResult != 'owner') {
    throw new Error('You are not authorized to update profile image');
  }

  const result = await pinFileToIPFS(file);
  return result;
}

export async function updateProfileAction(
  profile: Profile,
  alias: string,
  config: Config,
  account: string
) {
  const supabase = getServiceRoleClient(config.community.profile.chain_id);
  const profileContract = config.community.profile.address;

  //convert ipfs url to https url
  profile.image = convertIpfsUrl(profile.image);
  profile.image_medium = convertIpfsUrl(profile.image_medium);
  profile.image_small = convertIpfsUrl(profile.image_small);

  await updateMember({
    client: supabase,
    account,
    profileContract,
    profile
  });

  revalidatePath(`/${alias}/members`, 'page');
}

export async function deleteProfileAction(
  alias: string,
  config: Config,
  account: string
) {
  try {
    const supabase = getServiceRoleClient(config.community.profile.chain_id);
    const profileContract = config.community.profile.address;

    await removeMember({
      client: supabase,
      account,
      profileContract
    });

    revalidatePath(`/${alias}/members`, 'page');
  } catch (error) {
    console.error(error);
  }
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

export async function unpinAction(imageCid: string) {
  try {
    //unpin profile image
    const cid = imageCid.split('/').pop();
    await unpin(cid as string);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to unpin');
  }
}
