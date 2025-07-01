'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { getServiceRoleClient } from '@/services/top-db';
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

interface ProxyDeployParams {
  initializeArgs?: string[];
  privateKey: string;
  chainId: string;
}

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

export async function deployProfileAction({
  initializeArgs = [],
  privateKey,
  chainId
}: ProxyDeployParams): Promise<string | undefined> {
  try {
    // Connect to Polygon Amoy
    const provider = new ethers.JsonRpcProvider(CHAIN_ID_TO_RPC_URL(chainId));

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
    const provider = new ethers.JsonRpcProvider(CHAIN_ID_TO_RPC_URL(chainId));

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
    const provider = new ethers.JsonRpcProvider(CHAIN_ID_TO_RPC_URL(chainId));

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

export async function updateCommunityConfigAction(
  profileAddress: string,
  paymasterAddress: string,
  config: Config
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
      }
    },
    accounts: {
      ...config.accounts,
      [`${config.community.profile.chain_id}:${config.community.primary_account_factory.address}`]:
        {
          ...config.accounts[
            `${config.community.profile.chain_id}:${config.community.primary_account_factory.address}`
          ],
          paymaster_address: paymasterAddress
        }
    }
  };

  return updateJson;

  // try {
  //   const { data: updatedData, error } = await updateCommunityJson(
  //     client,
  //     config.community.alias,
  //     updateJson
  //   );

  //   if (error) {
  //     throw new Error('Failed to update community config');
  //   }

  //   return updatedData;
  // } catch (error) {
  //   console.error('Error updating community config:', error);
  //   throw new Error('Failed to update community config');
  // }
}
