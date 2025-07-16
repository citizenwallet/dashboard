'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { getServiceRoleClient } from '@/services/chain-db';
import {
  getPaymasterByAddress,
  Paymaster,
  updatePaymasterName,
  upsertPaymasterWhitelist
} from '@/services/chain-db/paymaster';
import { BundlerService, CommunityConfig, Config } from '@citizenwallet/sdk';
import { ethers, Wallet } from 'ethers';
import { revalidatePath } from 'next/cache';
import { PAYMASTER_ABI } from './contract/paymaster_contract';

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
      throw new Error('You are not authorized to update paymaster whitelist');
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

export const checkPaymasterWhitelistAddressExistsAction = async (args: {
  config: Config;
  address: string;
}) => {
  const { config, address } = args;

  const community = new CommunityConfig(config);
  const chainId = community.primaryToken.chain_id;
  const alias = community.community.alias;

  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });

  if (roleInApp != 'admin' && roleResult != 'owner') {
    throw new Error(
      'You are not authorized to check paymaster whitelist address'
    );
  }

  const supabase = getServiceRoleClient(chainId);
  return await getPaymasterByAddress({
    client: supabase,
    address: address,
    alias: alias
  });
};

export const refreshPaymasterWhitelistAction = async (args: {
  config: Config;
  data: Paymaster[];
}) => {
  const { config, data } = args;

  try {
    const communityConfig = new CommunityConfig(config);
    const bundler = new BundlerService(communityConfig);

    const chainId = communityConfig.primaryToken.chain_id;
    const paymasteraddress =
      communityConfig.primaryAccountConfig.paymaster_address;
    const alias = communityConfig.community.alias;

    const roleInApp = await getAuthUserRoleInAppAction();
    const roleResult = await getAuthUserRoleInCommunityAction({ alias });

    if (roleInApp != 'admin' && roleResult != 'owner') {
      throw new Error('You are not authorized to upload paymaster whitelist');
    }

    if (
      !process.env.WHITELIST_ACCOUNT_WALLET_PRIVATE_KEY ||
      !process.env.WHITELIST_ACCOUNT_ADDRESS
    ) {
      throw new Error(
        'WHITELIST_ACCOUNT_WALLET_PRIVATE_KEY or WHITELIST_ACCOUNT_ADDRESS is not set'
      );
    }

    const signer = new Wallet(
      process.env.WHITELIST_ACCOUNT_WALLET_PRIVATE_KEY as string
    );
    const signerAccountAddress = process.env
      .WHITELIST_ACCOUNT_ADDRESS as string;

    // Prepare the whitelist data
    const whitelist = data.map((item) => item.contract);

    // Call the bundler with the encoded data
    const hash = await bundler.call(
      signer,
      paymasteraddress,
      signerAccountAddress,
      ethers.getBytes(
        ethers.Interface.from(PAYMASTER_ABI).encodeFunctionData(
          'updateWhitelist',
          [whitelist]
        )
      )
    );

    // Wait for transaction success
    const isSuccess = await bundler.awaitSuccess(hash);

    if (!isSuccess) {
      throw new Error('Failed to update paymaster whitelist');
    }

    const supabase = getServiceRoleClient(chainId);
    const newdata = data.map((item) => ({
      ...item,
      published: hash
    }));

    await upsertPaymasterWhitelist({
      client: supabase,
      data: newdata
    });

    revalidatePath(`/${alias}/paymaster`, 'page');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
