'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { searchMembers } from '@/services/chain-db/members';
import {
  BundlerService,
  CommunityConfig,
  Config,
  getAccountAddress
} from '@citizenwallet/sdk';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import { Wallet } from 'ethers';
import { mintTokenFormSchema } from './mint/form-schema';
import { burnTokenFormSchema } from './burn/form-schema';
import { z } from 'zod';

export const searchMember = async (args: { config: Config; query: string }) => {
  const { config, query } = args;
  const { chain_id: chainId, address: profileContract } =
    config.community.profile;
  const { alias } = config.community;

  const authRole = await getAuthUserRoleInCommunityAction({
    alias
  });

  if (authRole !== 'owner') {
    throw new Error('Unauthorized');
  }

  const supabase = getServiceRoleClient(chainId);

  const { data, error } = await searchMembers({
    client: supabase,
    profileContract,
    query
  });

  if (error) {
    console.error(error);
  }

  return data ?? [];
};

export const mintTokenToMemberAction = async (args: {
  config: Config;
  formData: z.infer<typeof mintTokenFormSchema>;
}) => {
  const { config, formData } = args;
  const { chain_id: chainId, address: tokenAddress } =
    config.community.primary_token;
  const communityConfig = new CommunityConfig(config);
  const bundlerService = new BundlerService(communityConfig);

  const result = mintTokenFormSchema.safeParse(formData);

  if (!result.success) {
    console.error(result.error);
    throw new Error('Invalid form data');
  }

  const authRole = await getAuthUserRoleInCommunityAction({
    alias: config.community.alias
  });

  if (authRole !== 'owner') {
    throw new Error('You are not authorized to mint tokens');
  }

  const serverWalletPrivateKey = process.env['SERVER_PRIVATE_KEY'] ?? '';

  if (!serverWalletPrivateKey) {
    throw new Error('Signer cannot be found');
  }

  const signer = new Wallet(serverWalletPrivateKey);
  const signerAccountAddress = await getAccountAddress(
    new CommunityConfig(config),
    signer.address
  );

  if (!signerAccountAddress) {
    throw new Error('Signer account address cannot be found');
  }

  const {
    member: { account: to },
    amount,
    description
  } = formData;

  try {
    await bundlerService.mintERC20Token(
      signer,
      tokenAddress,
      signerAccountAddress,
      to,
      amount,
      description
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw error; // Rethrow the original error object
    }
    throw new Error('Failed to mint tokens'); // Fallback error message for non-Error objects
  }
};

export const burnTokenFromMemberAction = async (args: {
  config: Config;
  formData: z.infer<typeof burnTokenFormSchema>;
}) => {
  const { config, formData } = args;
  const { address: tokenAddress } = config.community.primary_token;
  const communityConfig = new CommunityConfig(config);
  const bundlerService = new BundlerService(communityConfig);

  const result = burnTokenFormSchema.safeParse(formData);

  if (!result.success) {
    console.error(result.error);
    throw new Error('Invalid form data');
  }

  const authRole = await getAuthUserRoleInCommunityAction({
    alias: config.community.alias
  });

  if (authRole !== 'owner') {
    throw new Error('You are not authorized to burn tokens');
  }

  const serverWalletPrivateKey = process.env['SERVER_PRIVATE_KEY'] ?? '';

  if (!serverWalletPrivateKey) {
    throw new Error('Signer cannot be found');
  }

  const signer = new Wallet(serverWalletPrivateKey);
  const signerAccountAddress = await getAccountAddress(
    new CommunityConfig(config),
    signer.address
  );

  if (!signerAccountAddress) {
    throw new Error('Signer account address cannot be found');
  }

  const {
    member: { account: to },
    amount,
    description
  } = formData;

  try {
    await bundlerService.burnFromERC20Token(
      signer,
      tokenAddress,
      signerAccountAddress,
      to,
      amount,
      description
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw error; // Rethrow the original error object
    }
    throw new Error('Failed to burn tokens'); // Fallback error message for non-Error objects
  }
};
