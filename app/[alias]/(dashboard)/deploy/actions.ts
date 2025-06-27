'use server';

import { ethers } from 'ethers';

interface DeployContractParams {
  abi: string;
  bytecode: string;
}

export interface DeploymentResult {
  success: boolean;
  data?: {
    contractAddress: string;
    transactionHash?: string;
    deployedBy: string;
  };
  error?: string;
}

export async function deployContract({
  abi,
  bytecode
}: DeployContractParams): Promise<DeploymentResult> {
  try {
    // Get the provider from environment variable
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );

    // Get the deployer's private key from environment variable
    const privateKey = process.env.PRIVATE_KEY || '';
    if (!privateKey) {
      throw new Error('Deployer private key not found');
    }

    // Create a wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Get the wallet's balance
    const balance = await provider.getBalance(wallet.address);

    // Parse the ABI and constructor arguments
    const parsedAbi = JSON.parse(abi);

    // Create contract factory
    const factory = new ethers.ContractFactory(parsedAbi, bytecode, wallet);

    // Deploy the contract with constructor arguments if provided
    const contract = await factory.deploy({
      gasLimit: 3000000
    });

    // Wait for deployment to complete
    await contract.waitForDeployment();

    // Get the contract address
    const contractAddress = await contract.getAddress();

    return {
      success: true,
      data: {
        contractAddress,
        transactionHash: contract.deploymentTransaction()?.hash,
        deployedBy: wallet.address
      }
    };
  } catch (error) {
    console.error('Contract deployment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
