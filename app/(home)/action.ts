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
import { getAuthUserAction } from '../_actions/user-actions';
import { addUserRowoCommunity } from '@/services/top-db/users';

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

const chainsDetails = [
  {
    id: '100',
    primary_account_factory: '0xBABCf159c4e3186cf48e4a48bC0AeC17CF9d90FE',
    entrypoint_address: '0xAAEb9DC18aDadae9b3aE7ec2b47842565A81113f'
  },
  {
    id: '42220',
    primary_account_factory: '0xAE6E18a9Cd26de5C8f89B886283Fc3f0bE5f04DD',
    entrypoint_address: '0x985ec7d08D9d15Ea79876E35FAdEFD58A627187E'
  },
  {
    id: '42161',
    primary_account_factory: '0x0000000000000000000000000000000000000000',
    entrypoint_address: '0x0000000000000000000000000000000000000000'
  },
  {
    id: '137',
    primary_account_factory: '0x940Cbb155161dc0C4aade27a4826a16Ed8ca0cb2',
    entrypoint_address: '0x7079253c0358eF9Fd87E16488299Ef6e06F403B6'
  }
];

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
    accounts: {
      [`${chainId}:${chainsDetails.find((chain) => chain.id === chainId)?.primary_account_factory || ''}`]:
        {
          chain_id: parseInt(chainId),
          entrypoint_address:
            chainsDetails.find((chain) => chain.id === chainId)
              ?.entrypoint_address || '',
          paymaster_address: '',
          account_factory_address:
            chainsDetails.find((chain) => chain.id === chainId)
              ?.primary_account_factory || '',
          paymaster_type: 'cw-safe'
        }
    },
    sessions: {},
    community: {
      url: '',
      logo: '',
      name: name,
      alias: alias,
      theme: { primary: '#1f6feb' },
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
        address:
          chainsDetails.find((chain) => chain.id === chainId)
            ?.primary_account_factory || '',
        chain_id: parseInt(chainId)
      },
      primary_session_manager: {
        address: '',
        chain_id: parseInt(chainId)
      }
    },
    config_location: ''
  };

  const user = await getAuthUserAction({ chain_id: parseInt(chainId) });
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
    addUserRowoCommunity({
      client,
      data: {
        user_id: Number(user.data?.id),
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
