'use server';

import { MemberT } from '@/services/chain-db/members';
import { deleteAccountFromRole, upsertAccountToRole } from '@/services/chain-db/role';
import {
  BundlerService,
  CommunityConfig,
  Config,
  MINTER_ROLE,
  waitForTxSuccess
} from '@citizenwallet/sdk';
import { Wallet } from 'ethers';
import { getServiceRoleClient } from '@/services/chain-db';
import { revalidatePath } from 'next/cache';

export interface MinterMembers {
  id: number;
  account_address: string;
  contract_address: string;
  role: string;
  created_at: string;
  a_member: MemberT;
}

export const grantRoleAction = async (args: {
  config: Config;
  account: string;
}) => {
  const { config, account } = args;
  const community = new CommunityConfig(config);
  const bundler = new BundlerService(community);
  const supabase = getServiceRoleClient(community.primaryToken.chain_id);

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
  const isSuccess = await waitForTxSuccess(community, hash);
  if (isSuccess) {
    await upsertAccountToRole({
      client: supabase,
      role: {
        account_address: account,
        contract_address: tokenAddress,
        role: MINTER_ROLE
      }
    });
    revalidatePath(`/${config.community.alias}/roles`);
    return { success: true };
  } else {
    return { success: false };
  }
};

export const revokeRoleAction = async (args: {
  config: Config;
  account: string;
}): Promise<{ success: boolean }> => {
  const { config, account } = args;
  const community = new CommunityConfig(config);
  const bundler = new BundlerService(community);
  const supabase = getServiceRoleClient(community.primaryToken.chain_id);

  const tokenAddress = community.primaryToken.address;

  const signer = new Wallet(process.env.SERVER_PRIVATE_KEY as string);
  const signerAccountAddress = process.env.SERVER_ACCOUNT_ADDRESS as string;

  const hash = await bundler.revokeRole(
    signer,
    tokenAddress,
    signerAccountAddress,
    MINTER_ROLE,
    account
  );
  const isSuccess = await waitForTxSuccess(community, hash);
  if (isSuccess) {
    await deleteAccountFromRole({
      client: supabase,
      role: {
        account_address: account,
        contract_address: tokenAddress,
        role: MINTER_ROLE
      }
    });
    revalidatePath(`/${config.community.alias}/roles`);
    return { success: true };
  } else {
    return { success: false };
  }
};
