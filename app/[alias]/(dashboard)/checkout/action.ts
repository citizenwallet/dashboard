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
import {
  Config,
  BundlerService,
  CommunityConfig,
  ConfigContractLocation,
  ConfigAccount,
  ConfigToken,
  ConfigCommunityProfile,
  getTokenMetadata,
  ConfigCommunity
} from '@citizenwallet/sdk';
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
import {
  getPrimaryCardManagerOfChain,
  getSessionModuleAddressOfChain
} from '@/lib/chain';
import { getCommunityByAliasAction } from '@/app/_actions/community-actions';

/**
 * Type definition for profile initialization arguments
 * @param _ownerAddress - The address of the profile owner
 */
type ProfileInitializeArgs = [_ownerAddress: string];

/**
 * Type definition for token initialization arguments
 * @param _ownerAddress - The address of the token owner
 * @param mintersAddresses - Array of addresses allowed to mint tokens
 * @param name - The name of the token
 * @param symbol - The symbol/ticker of the token
 */
type TokenInitializeArgs = [
  _ownerAddress: string,
  mintersAddresses: string[],
  name: string,
  symbol: string
];

/**
 * Type definition for paymaster initialization arguments
 * @param _ownerAddress - The address of the paymaster owner
 * @param aSponsor - The address of the sponsor
 * @param whitelistedAddresses - Array of addresses allowed to use the paymaster
 */
type PaymasterInitializeArgs = [
  _ownerAddress: string,
  aSponsor: string,
  whitelistedAddresses: string[]
];

const deploymentKey = process.env.SERVER_PRIVATE_KEY;

export async function deployProfileAction({
  profileInitializeArgs,
  chainId
}: {
  profileInitializeArgs: ProfileInitializeArgs;
  chainId: string;
}): Promise<string | undefined> {
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
    if (profileInitializeArgs.length > 0) {
      const contract = new ethers.Contract(
        implementationAddress,
        PROFILE_ABI,
        wallet
      );
      initData = contract.interface.encodeFunctionData(
        'initialize',
        profileInitializeArgs
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
  tokenAddress,
  ownerAddress
}: {
  chainId: string;
  profileAddress: string;
  tokenAddress: string;
  ownerAddress: string;
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
    const implementationFactory = new ethers.ContractFactory(
      PAYMASTER_ABI,
      PAYMASTER_BYTECODE,
      wallet
    );

    // Deploy the contract with constructor arguments if provided
    const implementation = await implementationFactory.deploy({
      gasLimit: 3000000
    });

    // Wait for deployment to complete
    await implementation.waitForDeployment();

    // Get the contract address
    const implementationAddress = await implementation.getAddress();

    // Create a new contract instance for interaction
    const paymasterContract = new ethers.Contract(
      implementationAddress,
      PAYMASTER_ABI,
      wallet
    );

    const primaryCardManager = getPrimaryCardManagerOfChain(chainId);
    const sessionModuleAddress = getSessionModuleAddressOfChain(chainId);

    // whitelisted addresses
    const whitelistedAddresses = [
      profileAddress,
      tokenAddress,
      primaryCardManager,
      sessionModuleAddress
    ];

    // TODO: to encrypt sponsor private key with DB password
    const walletForSponsor = Wallet.createRandom();
    const aSponsor = walletForSponsor.address;

    const initData = paymasterContract.interface.encodeFunctionData(
      'initialize',
      [ownerAddress, aSponsor, whitelistedAddresses] as PaymasterInitializeArgs
    );

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

    // ADD TO t_sponsor table
  } catch (error) {
    console.error('Contract deployment error:', error);
    throw new Error('Failed to deploy paymaster');
  }
}

export async function deployTokenAction({
  tokenInitializeArgs,
  chainId
}: {
  tokenInitializeArgs: TokenInitializeArgs;
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

    // 2. Prepare initialization data if needed
    let initData = '0x';
    if (tokenInitializeArgs.length > 0) {
      const contract = new ethers.Contract(contractAddress, TOKEN_ABI, wallet);
      initData = contract.interface.encodeFunctionData(
        'initialize',
        tokenInitializeArgs
      );
    }

    // 3. Deploy ERC1967Proxy
    const proxyFactory = new ethers.ContractFactory(
      ERC1967_ABI,
      ERC1967_BYTECODE,
      wallet
    );

    const proxy = await proxyFactory.deploy(contractAddress, initData, {
      gasLimit: 3000000
    });
    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();

    return proxyAddress;
  } catch (error) {
    console.error('Contract deployment error:', error);
    throw new Error('Failed to deploy token');
  }
}

export async function updateCommunityConfigAction(args: {
  profileAddress: string;
  paymasterAddress: string;
  alias: string;
  tokenAddress: string;
}) {
  const { profileAddress, paymasterAddress, alias, tokenAddress } = args;

  const client = getServiceRoleClient();

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias: alias
  });

  const roleInApp = await getAuthUserRoleInAppAction();

  if (!roleInApp) {
    throw new Error('Unauthenticated user');
  }

  if (roleInApp === 'user' && !roleInCommunity) {
    throw new Error('You are not a member of this community');
  }

  const community = await getCommunityByAliasAction(alias);
  const config = community.json;

  const primaryAccountFactory = getPrimaryAccountFactoryOfChain(
    config.community.profile.chain_id.toString()
  );
  const entrypointAddress = getEntrypointAddressOfChain(
    config.community.profile.chain_id.toString()
  );

  const updateJson: Config = {
    ...config,
    community: {
      ...config.community,
      profile: {
        ...config.community.profile,
        address: profileAddress
      } satisfies ConfigCommunityProfile,
      primary_token: {
        ...config.community.primary_token,
        address: tokenAddress || config.community.primary_token.address
      } satisfies ConfigContractLocation,
      primary_account_factory: {
        ...config.community.primary_account_factory,
        address: primaryAccountFactory
      } satisfies ConfigContractLocation
    } satisfies ConfigCommunity,
    accounts: {
      ...config.accounts,
      [`${config.community.profile.chain_id}:${primaryAccountFactory}`]: {
        chain_id: config.community.profile.chain_id,
        entrypoint_address: entrypointAddress,
        paymaster_address: paymasterAddress,
        account_factory_address: primaryAccountFactory,
        paymaster_type: 'cw-safe'
      } satisfies ConfigAccount
    },
    tokens: {
      ...(tokenAddress
        ? {
            // remove the token address from the tokens object
            ...Object.fromEntries(
              Object.entries(config.tokens).filter(
                ([key]) =>
                  key !==
                  `${config.community.profile.chain_id}:${config.community.primary_token.address}`
              )
            ),

            [`${config.community.profile.chain_id}:${tokenAddress}`]: {
              ...config.tokens[
                `${config.community.profile.chain_id}:${config.community.primary_token.address}`
              ],
              address: tokenAddress
            } satisfies ConfigToken
          }
        : config.tokens)
    }
  };

  const tokenMetadata = await getTokenMetadata(
    new CommunityConfig(updateJson),
    {
      tokenAddress: tokenAddress,
      rpcUrl: getRpcUrlOfChain(config.community.profile.chain_id.toString())
    }
  );

  const updatedJsonWithTokenMetadata: Config = {
    ...updateJson,
    tokens: {
      ...updateJson.tokens,
      [`${config.community.profile.chain_id}:${tokenAddress}`]: {
        ...updateJson.tokens[
          `${config.community.profile.chain_id}:${tokenAddress}`
        ],
        name: String(tokenMetadata?.name ?? ''),
        symbol: String(tokenMetadata?.symbol ?? ''),
        decimals: Number(tokenMetadata?.decimals ?? 0)
        // Add any other metadata fields you need
      } satisfies ConfigToken
    }
  };

  try {
    const { data: updatedData, error } = await updateCommunityJson(
      client,
      config.community.alias,
      { json: updatedJsonWithTokenMetadata }
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
