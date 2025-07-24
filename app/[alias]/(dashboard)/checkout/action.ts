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
import { Config, BundlerService, CommunityConfig } from '@citizenwallet/sdk';
import { ethers, Wallet } from 'ethers';
import {
  ERC1967_ABI,
  ERC1967_BYTECODE
} from './_contract/ERC1967Proxy_contract';
import {
  PAYMASTER_ABI,
  PAYMASTER_BYTECODE
} from './_contract/paymaster_contract';
import { PROFILE_ABI, PROFILE_BYTECODE } from './_contract/profile_contract';
import { TOKEN_ABI, TOKEN_BYTECODE } from './_contract/token_contract';
import {
  getRpcUrlOfChain,
  getPrimaryAccountFactoryOfChain,
  getEntrypointAddressOfChain
} from '@/lib/chain';
import { primaryCardManager, primarySessionManager } from '@/lib/address';

interface ProxyDeployParams {
  initializeArgs?: string[];
  chainId: string;
}

const deploymentKey = process.env.SERVER_PRIVATE_KEY;

export async function deployProfileAction({
  initializeArgs = [],
  chainId
}: ProxyDeployParams): Promise<string | undefined> {
  try {
    if (!deploymentKey) {
      throw new Error('Deployment key not configured');
    }

    // Connect to Polygon Amoy
    const provider = new ethers.JsonRpcProvider(getRpcUrlOfChain(chainId));

    // Your deployment wallet
    const wallet = new ethers.Wallet(deploymentKey, provider);

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
    throw new Error('Failed to deploy profile');
  }
}

export async function deployPaymasterAction({
  chainId,
  profileAddress,
  tokenAddress
}: {
  chainId: string;
  profileAddress: string;
  tokenAddress: string;
}): Promise<string | undefined> {
  try {
    if (!deploymentKey) {
      throw new Error('Deployment key not configured');
    }

    // Get the provider from environment variable
    const provider = new ethers.JsonRpcProvider(getRpcUrlOfChain(chainId));

    // Create a wallet instance
    const wallet = new ethers.Wallet(deploymentKey, provider);

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
      primaryCardManager,
      primarySessionManager
    ];

    // Initialize the contract with the deployer as sponsor and whitelisted addresses
    await paymasterContract.initialize(wallet.address, whitelistedAddresses, {
      gasLimit: 3000000
    });

    return contractAddress;
  } catch (error) {
    console.error('Contract deployment error:', error);
    throw new Error('Failed to deploy paymaster');
  }
}

export async function deployTokenAction({
  chainId
}: {
  chainId: string;
}): Promise<string | undefined> {
  try {
    if (!deploymentKey) {
      throw new Error('Deployment key not configured');
    }

    // Get the provider from environment variable
    const provider = new ethers.JsonRpcProvider(getRpcUrlOfChain(chainId));

    // Create a wallet instance
    const wallet = new ethers.Wallet(deploymentKey, provider);

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
    throw new Error('Failed to deploy token');
  }
}

export async function updateCommunityConfigAction(args: {
  profileAddress: string;
  paymasterAddress: string;
  config: Config;
  tokenAddress?: string;
}) {
  const { profileAddress, paymasterAddress, config, tokenAddress } = args;

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

  const primaryAccountFactory = getPrimaryAccountFactoryOfChain(
    config.community.profile.chain_id.toString()
  );
  const entrypointAddress = getEntrypointAddressOfChain(
    config.community.profile.chain_id.toString()
  );

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
        address: primaryAccountFactory
      }
    },
    accounts: {
      ...config.accounts,
      [`${config.community.profile.chain_id}:${primaryAccountFactory}`]: {
        chain_id: config.community.profile.chain_id,
        entrypoint_address: entrypointAddress,
        paymaster_address: paymasterAddress,
        account_factory_address: primaryAccountFactory,
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

export async function sendCtznToReceiverAction(args: {
  signer: Wallet;
  senderAddress: string;
  config: Config;
  amount: number;
}) {
  const { config, amount, signer, senderAddress } = args;

  if (!process.env.SEND_CTZN_TOKEN_ADDRESS) {
    throw new Error('CTZN receiver address not configured');
  }

  const receiverAddress = process.env.SEND_CTZN_TOKEN_ADDRESS;
  const ctznConfig = new CommunityConfig(config);
  const bundlerService = new BundlerService(ctznConfig);

  try {
    const hash = await bundlerService.sendERC20Token(
      signer,
      ctznConfig.primaryToken.address,
      senderAddress,
      receiverAddress,
      amount.toString(),
      'Deploying community'
    );

    return hash;
  } catch (error) {
    console.error('Error sending CTZN to receiver:', error);
    throw new Error('Failed to send CTZN to receiver');
  }
}
