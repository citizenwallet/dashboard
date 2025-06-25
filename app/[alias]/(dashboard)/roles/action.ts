'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { MemberT } from '@/services/chain-db/members';
import {
  deleteAccountFromRole,
  upsertAccountToRole
} from '@/services/chain-db/role';
import { CommunityConfig, Config, MINTER_ROLE } from '@citizenwallet/sdk';
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
  const supabase = getServiceRoleClient(community.primaryToken.chain_id);

  const tokenAddress = community.primaryToken.address;

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
};

export const revokeRoleAction = async (args: {
  config: Config;
  account: string;
}) => {
  const { config, account } = args;
  const community = new CommunityConfig(config);

  const supabase = getServiceRoleClient(community.primaryToken.chain_id);

  const tokenAddress = community.primaryToken.address;

  await deleteAccountFromRole({
    client: supabase,
    role: {
      account_address: account,
      contract_address: tokenAddress,
      role: MINTER_ROLE
    }
  });
  revalidatePath(`/${config.community.alias}/roles`);
};
