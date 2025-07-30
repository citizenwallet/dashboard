'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { pinFileToIPFS, pinJSONToIPFS, unpin } from '@/services/pinata/pinata';
import {
  BundlerService,
  CommunityConfig,
  Config,
  waitForTxSuccess
} from '@citizenwallet/sdk';
import { Wallet } from 'ethers';
import { getServiceRoleClient } from '@/services/chain-db';
import {
  MemberT,
  removeMember,
  updateMember
} from '@/services/chain-db/members';
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
  config: Config
) {
  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });

  if (roleInApp != 'admin' && roleResult != 'owner') {
    throw new Error('You are not authorized to update profile image');
  }

  const result = await pinJSONToIPFS(profile);
  const profileCid = result.IpfsHash;

  const community = new CommunityConfig(config);
  const bundler = new BundlerService(community);

  const signer = new Wallet(process.env.SERVER_PRIVATE_KEY as string);
  const signerAccountAddress = process.env.SERVER_ACCOUNT_ADDRESS as string;

  const account = profile.account;
  const username = profile.username;

  const txHash = await bundler.setProfile(
    signer,
    signerAccountAddress,
    account,
    username,
    profileCid
  );
  const isSuccess = await waitForTxSuccess(community, txHash);

  if (isSuccess) {
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
}

export async function deleteProfileAction(
  imageCid: string,
  alias: string,
  config: Config,
  account: string
) {
  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });

  if (roleInApp != 'admin' && roleResult != 'owner') {
    throw new Error('You are not authorized to update profile image');
  }

  try {
    //unpin profile image
    const cid = imageCid.split('/').pop();
    await unpin(cid as string);

    const community = new CommunityConfig(config);
    const bundler = new BundlerService(community);

    const signer = new Wallet(process.env.SERVER_PRIVATE_KEY as string);
    const signerAccountAddress = process.env.SERVER_ACCOUNT_ADDRESS as string;

    const txHash = await bundler.burnProfile(
      signer,
      signerAccountAddress,
      account
    );

    const isSuccess = await waitForTxSuccess(community, txHash);

    if (isSuccess) {
      const supabase = getServiceRoleClient(config.community.profile.chain_id);
      const profileContract = config.community.profile.address;

      await removeMember({
        client: supabase,
        account,
        profileContract
      });

      revalidatePath(`/${alias}/members`, 'page');
    }
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