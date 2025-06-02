'use server';

import { generateRandomString } from '@/helpers/formatting';
import { getServiceRoleClient } from '@/services/top-db';
import {
  createCommunity,
  getCommunityByAlias
} from '@/services/top-db/community';

export const generateUniqueSlugAction = async (baseSlug: string) => {
  let slug = baseSlug;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const client = getServiceRoleClient();

    const { data, error } = await getCommunityByAlias(client, slug);

    if (error && error.code !== 'PGRST116') {
      throw new Error('Error checking slug uniqueness');
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${generateRandomString(4)}`;
    attempts++;
  }

  throw new Error('Unable to generate unique slug after max attempts');
};

export const checkAliasAction = async (alias: string) => {
  const client = getServiceRoleClient();

  const { data, error } = await getCommunityByAlias(client, alias);

  if (error && error.code !== 'PGRST116') {
    throw new Error('Error checking alias availability');
  }
  return !data;
};

export const createCommunityAction = async (
  chainId: string,
  name: string,
  alias: string
) => {
  const client = getServiceRoleClient();

  // Generate the community JSON configuration
  const communityConfig = {
    ipfs: { url: '' },
    scan: { url: '', name: '' },
    cards: {},
    chains: {},
    tokens: {},
    plugins: [],
    version: 4,
    accounts: {},
    sessions: {},
    community: {
      url: '',
      logo: '',
      name: name,
      alias: alias,
      theme: { primary: '' },
      profile: {
        address: '',
        chain_id: parseInt(chainId)
      },
      description: `The ${name} community`,
      primary_token: {
        address: '',
        chain_id: parseInt(chainId)
      },
      primary_card_manager: {
        address: '',
        chain_id: parseInt(chainId)
      },
      primary_account_factory: {
        address: '',
        chain_id: parseInt(chainId)
      },
      primary_session_manager: {
        address: '',
        chain_id: parseInt(chainId)
      }
    },
    config_location: ''
  };

  const { data, error } = await createCommunity(client, {
    chain_id: parseInt(chainId),
    alias: alias,
    active: false,
    created_at: new Date(),
    updated_at: new Date(),
    json: communityConfig
  });

  if (error) {
    throw new Error('Error creating community');
  }
  return data;
};
