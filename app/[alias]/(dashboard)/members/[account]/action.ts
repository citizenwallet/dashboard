'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { pinFileToIPFS, pinJSONToIPFS, unpin } from '@/services/pinata/pinata';
import { BundlerService, Config, CommunityConfig } from '@citizenwallet/sdk';
import { Wallet } from 'ethers';

export interface Profile {
  account: string;
  description: string;
  image: string;
  image_medium: string;
  image_small: string;
  name: string;
  username: string;
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

  await bundler.setProfile(
    signer,
    signerAccountAddress,
    account,
    username,
    profileCid
  );
  return 'success';
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
    const result = await unpin(cid as string);

    const community = new CommunityConfig(config);
    const bundler = new BundlerService(community);

    const signer = new Wallet(process.env.SERVER_PRIVATE_KEY as string);
    const signerAccountAddress = process.env.SERVER_ACCOUNT_ADDRESS as string;

    const txHash = await bundler.burnProfile(
      signer,
      signerAccountAddress,
      account
    );

    return {
      success: true,
      message: 'Profile deleted successfully',
      txHash
    };
  } catch (error) {
    return {
      success: false,
      message: error
    };
  }
}
