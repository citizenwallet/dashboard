'use server';

import {
  BundlerService,
  CommunityConfig,
  Config,
  MINTER_ROLE
} from '@citizenwallet/sdk';
import { Wallet } from 'ethers';

export const grantRoleAction = async (args: {
  config: Config;
  account: string;
}) => {
  const { config, account } = args;
  const community = new CommunityConfig(config);
  const bundler = new BundlerService(community);

  const tokenAddress = community.primaryToken.address;

  const signer = new Wallet(process.env.SERVER_PRIVATE_KEY as string);
  const signerAccountAddress = process.env.SERVER_ACCOUNT_ADDRESS as string;

  const hash = await bundler.grantRole(
    signer,
    tokenAddress,
    signerAccountAddress,
    MINTER_ROLE,
    account
  );
  console.log('hash', hash);
  return hash;
};
