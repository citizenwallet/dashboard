'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { getServiceRoleClient } from '@/services/top-db';
import {
  activeCommunity,
  updateCommunityJson
} from '@/services/top-db/community';
import { Config } from '@citizenwallet/sdk';
import { ethers } from 'ethers';
import {
  ERC1967_ABI,
  ERC1967_BYTECODE
} from './contract/ERC1967Proxy_contract';
import {
  PAYMASTER_ABI,
  PAYMASTER_BYTECODE
} from './contract/paymaster_contract';
import { PROFILE_ABI, PROFILE_BYTECODE } from './contract/profile_contract';
import { TOKEN_ABI, TOKEN_BYTECODE } from './contract/token_contract';
import { getRpcUrlOfChain } from '@/lib/chain';

interface ProxyDeployParams {
  initializeArgs?: string[];
  privateKey: string;
  chainId: string;
}

export async function deployProfileAction({
  initializeArgs = [],
  privateKey,
  chainId
}: ProxyDeployParams): Promise<string | undefined> {
  try {
    // Connect to Polygon Amoy
    const provider = new ethers.JsonRpcProvider(getRpcUrlOfChain(chainId));

    // Your deployment wallet
    const wallet = new ethers.Wallet(privateKey, provider);

    // 1. Deploy Implementation Contract
    const implementationFactory = new ethers.ContractFactory(
      PROFILE_ABI,
      PROFILE_BYTECODE,
      wallet
    );

    const implementation = await implementationFactory.deploy({
      gasLimit: 3000000
    });
    await implementation.waitForDeployment();
    const implementationAddress = await implementation.getAddress();

    // 2. Prepare initialization data if needed
    let initData = '0x';
    if (initializeArgs.length > 0) {
      const contract = new ethers.Contract(
        implementationAddress,
        PROFILE_ABI,
        wallet
      );
      initData = contract.interface.encodeFunctionData(
        'initialize',
        initializeArgs
      );
    }

    // 3. Deploy ERC1967Proxy
    const proxyFactory = new ethers.ContractFactory(
      ERC1967_ABI,
      ERC1967_BYTECODE,
      wallet
    );

    const proxy = await proxyFactory.deploy(implementationAddress, initData, {
      gasLimit: 3000000
    });
    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();

    return proxyAddress;
  } catch (error) {
    console.error('Proxy deployment error:', error);
  }
}

export async function deployPaymasterAction({
  privateKey,
  chainId,
  profileAddress,
  tokenAddress
}: {
  privateKey: string;
  chainId: string;
  profileAddress: string;
  tokenAddress: string;
}): Promise<string | undefined> {
  try {
    // Get the provider from environment variable
    const provider = new ethers.JsonRpcProvider(getRpcUrlOfChain(chainId));

    // Create a wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create contract factory
    const factory = new ethers.ContractFactory(
      PAYMASTER_ABI,
      PAYMASTER_BYTECODE,
      wallet
    );

    // Deploy the contract with constructor arguments if provided
    const contract = await factory.deploy({
      gasLimit: 3000000
    });

    // Wait for deployment to complete
    await contract.waitForDeployment();

    // Get the contract address
    const contractAddress = await contract.getAddress();

    // Create a new contract instance for interaction
    const paymasterContract = new ethers.Contract(
      contractAddress,
      PAYMASTER_ABI,
      wallet
    );

    // whitelisted addresses
    const whitelistedAddresses = [
      profileAddress,
      tokenAddress,
      '0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28', // Card Manager
      '0xE2F3DC3E638113b9496060349e5332963d9C1152' // Session Manager
    ];

    // Initialize the contract with the deployer as sponsor and whitelisted addresses
    await paymasterContract.initialize(wallet.address, whitelistedAddresses, {
      gasLimit: 3000000
    });

    return contractAddress;
  } catch (error) {
    console.error('Contract deployment error:', error);
  }
}

export async function deployTokenAction({
  privateKey,
  chainId
}: {
  privateKey: string;
  chainId: string;
}): Promise<string | undefined> {
  try {
    // Get the provider from environment variable
    const provider = new ethers.JsonRpcProvider(getRpcUrlOfChain(chainId));

    // Create a wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create contract factory
    const factory = new ethers.ContractFactory(
      TOKEN_ABI,
      TOKEN_BYTECODE,
      wallet
    );

    // Deploy the contract with constructor arguments if provided
    const contract = await factory.deploy({
      gasLimit: 3000000
    });

    // Wait for deployment to complete
    await contract.waitForDeployment();

    // Get the contract address
    const contractAddress = await contract.getAddress();

    return contractAddress;
  } catch (error) {
    console.error('Contract deployment error:', error);
  }
}

const chains = [
  {
    id: '100',
    primary_account_factory: '0xBABCf159c4e3186cf48e4a48bC0AeC17CF9d90FE',
    entrypoint_address: '0xAAEb9DC18aDadae9b3aE7ec2b47842565A81113f'
  },
  {
    id: '42220',
    primary_account_factory: '0xcd8b1B9E760148c5026Bc5B0D56a5374e301FDcA',
    entrypoint_address: '0x66fE9c22CcA49B257dd4F00508AC90198d99Bf27'
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

export async function updateCommunityConfigAction(
  profileAddress: string,
  paymasterAddress: string,
  config: Config,
  tokenAddress?: string
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

  const updateJson = {
    ...config,
    community: {
      ...config.community,
      profile: {
        ...config.community.profile,
        address: profileAddress
      },
      primary_token: {
        ...config.community.primary_token,
        address: tokenAddress || config.community.primary_token.address
      },
      primary_account_factory: {
        ...config.community.primary_account_factory,
        address:
          chains.find(
            (chain) => Number(chain.id) === config.community.profile.chain_id
          )?.primary_account_factory || ''
      }
    },
    accounts: {
      ...config.accounts,
      [`${config.community.profile.chain_id}:${chains.find((chain) => Number(chain.id) === config.community.profile.chain_id)?.primary_account_factory}`]:
        {
          chain_id: config.community.profile.chain_id,
          entrypoint_address: chains.find(
            (chain) => Number(chain.id) === config.community.profile.chain_id
          )?.entrypoint_address,
          paymaster_address: paymasterAddress,
          account_factory_address: chains.find(
            (chain) => Number(chain.id) === config.community.profile.chain_id
          )?.primary_account_factory,
          paymaster_type: 'cw-safe'
        }
    },
    tokens: {
      ...(tokenAddress
        ? {
            // remove the token address from the tokens object
            ...Object.fromEntries(
              Object.entries(config.tokens).filter(
                ([key]) =>
                  key !==
                  `${config.community.profile.chain_id}:${ethers.ZeroAddress}`
              )
            ),

            [`${config.community.profile.chain_id}:${tokenAddress}`]: {
              ...config.tokens[
                `${config.community.profile.chain_id}:${ethers.ZeroAddress}`
              ],
              address: tokenAddress
            }
          }
        : config.tokens)
    }
  } as Config;

  try {
    const { data: updatedData, error } = await updateCommunityJson(
      client,
      config.community.alias,
      { json: updateJson }
    );

    if (error) {
      throw new Error('Failed to update community config');
    }

    await activeCommunity(client, config.community.alias);

    return updatedData;
  } catch (error) {
    console.error('Error updating community config:', error);
    throw new Error('Failed to update community config');
  }
}
