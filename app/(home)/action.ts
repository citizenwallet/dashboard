'use server';

import { generateRandomString } from '@/helpers/formatting';
import {
  sanitizeAlias,
  isValidAlias
} from '@/app/(home)/_components/alias-utils';
import { getServiceRoleClient } from '@/services/top-db';
import {
  createCommunity,
  getCommunityByAlias
} from '@/services/top-db/community';
import { addUserToCommunity } from '@/services/top-db/users';
import { getAuthUserAction } from '../_actions/user-actions';

export const generateUniqueSlugAction = async (baseSlug: string) => {
  let slug = sanitizeAlias(baseSlug);

  if (!isValidAlias(slug)) {
    throw new Error(
      'Invalid alias format. Alias must contain only lowercase letters, numbers, and hyphens.'
    );
  }

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

    // When generating a new slug variant, ensure it remains valid
    slug = sanitizeAlias(`${baseSlug}-${generateRandomString(4)}`);
    attempts++;
  }

  throw new Error('Unable to generate unique slug after max attempts');
};

export const checkAliasAction = async (alias: string) => {
  const sanitizedAlias = sanitizeAlias(alias);

  if (!isValidAlias(sanitizedAlias)) {
    throw new Error(
      'Invalid alias format. Alias must contain only lowercase letters, numbers, and hyphens.'
    );
  }

  const client = getServiceRoleClient();

  const { data, error } = await getCommunityByAlias(client, sanitizedAlias);

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
    chains: {
      [chainId]: {
        id: parseInt(chainId),
        node: {
          url: `https://${chainId}.engine.citizenwallet.xyz`,
          ws_url: `wss://${chainId}.engine.citizenwallet.xyz`
        }
      }
    },
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

  const user = await getAuthUserAction();
  if (!user) {
    throw new Error('User not found');
  }

  const [communityResult] = await Promise.allSettled([
    createCommunity(client, {
      chain_id: parseInt(chainId),
      alias: alias,
      active: false,
      created_at: new Date(),
      updated_at: new Date(),
      json: communityConfig
    }),
    addUserToCommunity({
      client,
      data: {
        user_id: Number(user.id),
        chain_id: parseInt(chainId),
        alias: alias,
        role: 'owner'
      }
    })
  ]);

  const data =
    communityResult.status === 'fulfilled' ? communityResult.value.data : [];

  return data;
};
