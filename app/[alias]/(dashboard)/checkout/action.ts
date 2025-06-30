'use server';

import { ethers } from 'ethers';
import {
  ERC1967_ABI,
  ERC1967_BYTECODE
} from './contract/ERC1967Proxy_contract';
import { PROFILE_ABI, PROFILE_BYTECODE } from './contract/profile_contract';

interface ProxyDeployParams {
  initializeArgs?: any[];
  privateKey: string;
  chainId: string;
}

export const CHAIN_ID_TO_RPC_URL = (chainId: string) => {
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
