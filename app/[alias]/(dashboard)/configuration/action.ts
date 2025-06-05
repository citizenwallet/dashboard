'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { uploadImage } from '@/services/storage';
import { getServiceRoleClient } from '@/services/top-db';
import { updateCommunityJson } from '@/services/top-db/community';
import { Config } from '@citizenwallet/sdk';

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
        primary_token: {
          ...config.community.primary_token,
          address: tokenAddress
        }
      }
    };

    const { data, error } = await updateCommunityJson(
      client,
      config.community.alias,
      { json: updateJson }
    );

    if (error) {
      console.error('Error updating community json:', error);
      throw new Error('Failed to update community json');
    }

    return data;
  } catch (error) {
    console.error('Error creating BYOC:', error);
    throw new Error('Failed to create BYOC');
  }
}
