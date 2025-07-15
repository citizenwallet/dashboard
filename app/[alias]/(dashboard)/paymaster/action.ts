'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { getServiceRoleClient } from '@/services/chain-db';
import { updatePaymasterName } from '@/services/chain-db/paymaster';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { revalidatePath } from 'next/cache';

export const updatePaymasterNameAction = async (args: {
  config: Config;
  paymaster: string;
  name: string;
}) => {
  try {
    const { config, paymaster, name } = args;

    const community = new CommunityConfig(config);
    const chainId = community.primaryToken.chain_id;
    const alias = community.community.alias;

    const roleInApp = await getAuthUserRoleInAppAction();
    const roleResult = await getAuthUserRoleInCommunityAction({ alias });

    if (roleInApp != 'admin' && roleResult != 'owner') {
      throw new Error('You are not authorized to update profile image');
    }

    const supabase = getServiceRoleClient(chainId);

    await updatePaymasterName({
      client: supabase,
      contract: paymaster,
      name: name,
      alias: alias
    });

    revalidatePath(`/${alias}/paymaster`, 'page');
  } catch (error) {
    console.error(error);
  }
};
