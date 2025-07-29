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
import {
  getBlockExplorerOfChain,
  getConfigLocationOfAlias,
  getIpfsOfChain,
  getPrimaryCardManagerOfChain,
  getSessionFactoryAddressOfChain,
  getSessionModuleAddressOfChain,
  getSessionProviderAddressOfChain
} from '@/lib/chain';
import { ConfigSession, ConfigSafeCard, ConfigScan, ConfigIPFS, Config } from '@citizenwallet/sdk';

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

  const primaryCardManager = getPrimaryCardManagerOfChain(chainId);
  const sessionModuleAddress = getSessionModuleAddressOfChain(chainId);
  const sessionFactoryAddress = getSessionFactoryAddressOfChain(chainId);
  const sessionProviderAddress = getSessionProviderAddressOfChain(chainId);
  const blockExplorer = getBlockExplorerOfChain(chainId);
  const chainIpfs = getIpfsOfChain(chainId);
  const aliasConfigLocation = getConfigLocationOfAlias(alias);

  const cards = {
    [`${chainId}:${primaryCardManager}`]: {
      type: 'safe',
      address: primaryCardManager,
      chain_id: parseInt(chainId),
      instance_id: alias
    }
  } satisfies { [key: string]: ConfigSafeCard };

  const sessions = {
    [`${chainId}:${sessionModuleAddress}`]: {
      chain_id: parseInt(chainId),
      module_address: sessionModuleAddress,
      factory_address: sessionFactoryAddress,
      provider_address: sessionProviderAddress
    }
  } satisfies { [key: string]: ConfigSession };

  const scan = {
    url: blockExplorer.url,
    name: blockExplorer.name
  } satisfies ConfigScan;

  const ipfs = {
    url: chainIpfs.url
  } satisfies ConfigIPFS;

  // Generate the community JSON configuration
  const communityConfig: Config = {
    ipfs,
    scan,
    cards,
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
    sessions,
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
        address: primaryCardManager,
        chain_id: parseInt(chainId)
      },
      primary_account_factory: {
        address: '',
        chain_id: parseInt(chainId)
      },
      primary_session_manager: {
        address: sessionModuleAddress,
        chain_id: parseInt(chainId)
      }
    },
    config_location: aliasConfigLocation
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
