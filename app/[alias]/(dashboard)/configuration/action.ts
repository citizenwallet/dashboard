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
import { CommunityConfig, Config, getTokenMetadata, ConfigToken, TRANSFER_EVENT_SIGNATURE } from '@citizenwallet/sdk';
import { ethers } from 'ethers';
import { getRpcUrlOfChain } from '@/lib/chain';




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
          standard: 'erc20',
          logo: icon
        } satisfies ConfigToken
      },
      community: {
        ...config.community,
        primary_token: {
          ...config.community.primary_token,
          address: tokenAddress
        }
      } 
    } satisfies Config;

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
            TRANSFER_EVENT_SIGNATURE,
          topic:
            ethers.id(TRANSFER_EVENT_SIGNATURE),
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
          standard: 'erc20',
          logo: icon
        } satisfies ConfigToken
      },
      community: {
        ...config.community,
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
  const rpcUrl = getRpcUrlOfChain(
    config.community.profile.chain_id.toString()
  );

  const tokenMetadata = await getTokenMetadata(communityConfig, {
    tokenAddress,
    rpcUrl
  });

  return tokenMetadata;
}
