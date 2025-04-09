'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { pinFileToIPFS, pinJSONToIPFS } from '@/services/pinata/pinata';
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
  console.log('image uploaded-->', result);
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

  console.log('profileCid-->', profileCid);

  // const profileCid = 'QmZytUFpAmcBk5QbbJhqyxUiy5duVX8Q8atsb23XH3h8wH';

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

export async function demoAction(config: Config) {
  console.log(config);
  const communityConfig = new CommunityConfig(config);
  const bundlerService = new BundlerService(communityConfig);

  const signer = new Wallet(process.env.SERVER_PRIVATE_KEY ?? '');
  const signerAccountAddress = process.env.SERVER_ACCOUNT_ADDRESS ?? '';

  const profileAccountAddress = '0x14808C00d0b434a4035ecC8B129462Cd63B6215A';
  const username = 'randika';
  const ipfsHash = 'QmRH8uHUZmtgjp67pWhdKeZzq1SLqpzdymxR81hXRQ16KA';

  try {
    await bundlerService.setProfile(
      signer,
      signerAccountAddress,
      profileAccountAddress,
      username,
      ipfsHash
    );
  } catch (error) {
    console.error(error);
    throw error;
  }

  return 'success';
}
