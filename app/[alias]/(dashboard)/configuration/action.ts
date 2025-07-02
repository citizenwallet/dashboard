'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { getServiceRoleClient as getServiceRoleClientChainDb } from '@/services/chain-db';
import { insertEvent } from '@/services/chain-db/event';
import { uploadImage } from '@/services/storage';
import { getServiceRoleClient } from '@/services/top-db';
import { updateCommunityJson } from '@/services/top-db/community';
import { CommunityConfig, Config, getTokenMetadata } from '@citizenwallet/sdk';
import { ethers } from 'ethers';

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

export async function uploadIconAction(imageFile: File, alias: string) {
  const client = getServiceRoleClient();

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias
  });

  const roleInApp = await getAuthUserRoleInAppAction();

  if (!roleInApp) {
    throw new Error('Unauthenticated user');
  }

  if (roleInApp === 'user' && !roleInCommunity) {
    throw new Error('You are not a member of this community');
  }

  try {
    // Upload the image to storage
    const imageUrl = await uploadImage(client, imageFile, alias);

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function createByocAction(
  config: Config,
  tokenAddress: string,
  icon: string,
  decimals: number,
  symbol: string,
  name: string
) {
  const client = getServiceRoleClient();

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias: config.community.alias
  });

  const roleInApp = await getAuthUserRoleInAppAction();

  if (!roleInApp) {
    throw new Error('Unauthenticated user');
  }

  if (roleInApp === 'user' && !roleInCommunity) {
    throw new Error('You are not a member of this community');
  }

  try {
    const updateJson = {
      ...config,
      tokens: {
        ...config.tokens,
        [`${config.community.primary_token.chain_id}:${tokenAddress}`]: {
          name,
          symbol,
          address: tokenAddress,
          chain_id: config.community.primary_token.chain_id,
          decimals,
          standard: 'erc20'
        }
      },
      community: {
        ...config.community,
        logo: icon,
        primary_token: {
          ...config.community.primary_token,
          address: tokenAddress
        }
      }
    };

    const [updateCommunityJsonPromise] = await Promise.allSettled([
      updateCommunityJson(client, config.community.alias, {
        json: updateJson
      }),

      insertEvent({
        client: getServiceRoleClientChainDb(
          config.community.primary_token.chain_id
        ),
        chainId: config.community.primary_token.chain_id.toString(),
        event: {
          name: `${config.community.alias} Transfer`,
          contract: tokenAddress,
          event_signature:
            'Transfer (index_topic_1 address from, index_topic_2 address to, uint256 value)',
          topic:
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          alias: config.community.alias
        }
      })
    ]);

    const data =
      updateCommunityJsonPromise.status === 'fulfilled'
        ? updateCommunityJsonPromise.value.data
        : [];

    return data;
  } catch (error) {
    console.error('Error creating BYOC:', error);
    throw new Error('Failed to create BYOC');
  }
}

export async function createTokenAction(
  config: Config,
  icon: string,
  symbol: string,
  name: string
) {
  const client = getServiceRoleClient();

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias: config.community.alias
  });

  const roleInApp = await getAuthUserRoleInAppAction();

  if (!roleInApp) {
    throw new Error('Unauthenticated user');
  }

  if (roleInApp === 'user' && !roleInCommunity) {
    throw new Error('You are not a member of this community');
  }

  try {
    const tokenAddress = ethers.ZeroAddress;

    const updateJson = {
      ...config,
      tokens: {
        ...config.tokens,
        [`${config.community.primary_token.chain_id}:${tokenAddress}`]: {
          name,
          symbol,
          address: tokenAddress,
          chain_id: config.community.primary_token.chain_id,
          decimals: 18,
          standard: 'erc20'
        }
      },
      community: {
        ...config.community,
        logo: icon,
        primary_token: {
          ...config.community.primary_token,
          address: tokenAddress
        }
      }
    };

    const updateCommunity = await updateCommunityJson(
      client,
      config.community.alias,
      {
        json: updateJson
      }
    );

    return updateCommunity;
  } catch (error) {
    console.error('Error creating token:', error);
  }
}

export async function getTokenMetadataAction(
  config: Config,
  tokenAddress: string
) {
  const communityConfig = new CommunityConfig(config);
  const rpcUrl = CHAIN_ID_TO_RPC_URL(
    communityConfig.primaryToken.chain_id.toString()
  );

  const tokenMetadata = await getTokenMetadata(communityConfig, {
    tokenAddress,
    rpcUrl
  });

  return tokenMetadata;
}
