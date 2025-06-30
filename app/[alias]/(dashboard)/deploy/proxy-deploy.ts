'use server';

import { ethers } from 'ethers';

const ERC1967_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'implementation', type: 'address' },
      { internalType: 'bytes', name: '_data', type: 'bytes' }
    ],
    stateMutability: 'payable',
    type: 'constructor'
  },
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
    name: 'AddressEmptyCode',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'address', name: 'implementation', type: 'address' }
    ],
    name: 'ERC1967InvalidImplementation',
    type: 'error'
  },
  { inputs: [], name: 'ERC1967NonPayable', type: 'error' },
  { inputs: [], name: 'FailedInnerCall', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  { stateMutability: 'payable', type: 'fallback' }
];

// Minimal proxy bytecode
const ERC1967_BYTECODE =
  '60806040526040516103f03803806103f08339810160408190526100229161025e565b61002c8282610033565b5050610341565b61003c82610091565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b905f90a280511561008557610080828261010c565b505050565b61008d61017f565b5050565b806001600160a01b03163b5f036100cb57604051634c9c8ce360e01b81526001600160a01b03821660048201526024015b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b60605f80846001600160a01b0316846040516101289190610326565b5f60405180830381855af49150503d805f8114610160576040519150601f19603f3d011682016040523d82523d5f602084013e610165565b606091505b5090925090506101768583836101a0565b95945050505050565b341561019e5760405163b398979f60e01b815260040160405180910390fd5b565b6060826101b5576101b0826101ff565b6101f8565b81511580156101cc57506001600160a01b0384163b155b156101f557604051639996b31560e01b81526001600160a01b03851660048201526024016100c2565b50805b9392505050565b80511561020f5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b634e487b7160e01b5f52604160045260245ffd5b5f5b8381101561025657818101518382015260200161023e565b50505f910152565b5f806040838503121561026f575f80fd5b82516001600160a01b0381168114610285575f80fd5b60208401519092506001600160401b03808211156102a1575f80fd5b818501915085601f8301126102b4575f80fd5b8151818111156102c6576102c6610228565b604051601f8201601f19908116603f011681019083821181831017156102ee576102ee610228565b81604052828152886020848701011115610306575f80fd5b61031783602083016020880161023c565b80955050505050509250929050565b5f825161033781846020870161023c565b9190910192915050565b60a38061034d5f395ff3fe6080604052600a600c565b005b60186014601a565b6050565b565b5f604b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b905090565b365f80375f80365f845af43d5f803e8080156069573d5ff35b3d5ffdfea26469706673582212201dd6f1a1d815e0cd15745b59d3120e2064459c7fee5248ed79c39f9848bad89c64736f6c63430008140033';

interface ProxyDeployParams {
  implementationABI: string;
  implementationBytecode: string;
  initializeArgs?: any[];
}

export interface ProxyDeployResult {
  success: boolean;
  data?: {
    implementationAddress: string;
    proxyAddress: string;
    transactionHash?: string;
  };
  error?: string;
}

export async function deployWithProxy({
  implementationABI,
  implementationBytecode,
  initializeArgs = []
}: ProxyDeployParams): Promise<ProxyDeployResult> {
  try {
    // Connect to Polygon Amoy
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );

    // Your deployment wallet
    const privateKey = process.env.PRIVATE_KEY || '';
    const wallet = new ethers.Wallet(privateKey, provider);

    // 1. Deploy Implementation Contract
    const implementationFactory = new ethers.ContractFactory(
      JSON.parse(implementationABI),
      implementationBytecode,
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
        JSON.parse(implementationABI),
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
      success: true,
      data: {
        implementationAddress,
        proxyAddress,
        transactionHash: proxy.deploymentTransaction()?.hash
      }
    };
  } catch (error) {
    console.error('Proxy deployment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
