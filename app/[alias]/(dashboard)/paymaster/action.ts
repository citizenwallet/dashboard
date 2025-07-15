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
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { ethers } from 'ethers';
import { revalidatePath } from 'next/cache';
import { PAYMASTER_ABI } from './contract/paymaster_contract';

const CHAIN_ID_TO_RPC_URL = (chainId: string) => {
  switch (chainId) {
    case '137':
      return process.env.POLYGON_RPC_URL;
    case '100':
      return process.env.GNOSIS_RPC_URL;
    case '42220':
      return process.env.CELO_RPC_URL;
    case '42161':
      return process.env.ARBITRUM_RPC_URL;
    default:
      return process.env.BASE_RPC_URL;
  }
};

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
    const chainId = communityConfig.primaryToken.chain_id;
    const paymasteraddress =
      communityConfig.primaryAccountConfig.paymaster_address;
    const alias = communityConfig.community.alias;

    const roleInApp = await getAuthUserRoleInAppAction();
    const roleResult = await getAuthUserRoleInCommunityAction({ alias });

    if (roleInApp != 'admin' && roleResult != 'owner') {
      throw new Error('You are not authorized to upload paymaster whitelist');
    }

    if (!process.env.WHITELIST_ACCOUNT_WALLET_PRIVATE_KEY) {
      throw new Error('WHITELIST_ACCOUNT_WALLET_PRIVATE_KEY is not set');
    }

    const provider = new ethers.JsonRpcProvider(
      CHAIN_ID_TO_RPC_URL(chainId.toString())
    );

    const wallet = new ethers.Wallet(
      process.env.WHITELIST_ACCOUNT_WALLET_PRIVATE_KEY,
      provider
    );

    const paymasterContract = new ethers.Contract(
      paymasteraddress,
      PAYMASTER_ABI,
      wallet
    );

    const whitelist = data.map((item) => item.contract);

    const tx = await paymasterContract.updateWhitelist(whitelist);

    const receipt = await tx.wait();
    const txHash = receipt.hash;

    const supabase = getServiceRoleClient(chainId);
    const newdata = data.map((item) => ({
      ...item,
      published: txHash
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
