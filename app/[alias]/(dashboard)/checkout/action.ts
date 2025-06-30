'use server';

import { ethers } from 'ethers';
import {
  ERC1967_ABI,
  ERC1967_BYTECODE
} from './contract/ERC1967Proxy_contract';
import { PROFILE_ABI, PROFILE_BYTECODE } from './contract/profile_contract';
import {
  PAYMASTER_ABI,
  PAYMASTER_BYTECODE
} from './contract/paymaster_contract';

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
}: ProxyDeployParams) {
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

    return {
      implementationAddress,
      proxyAddress,
      transactionHash: proxy.deploymentTransaction()?.hash
    };
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
}) {
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
