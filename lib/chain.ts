export type ChainOption = {
  id: string;
  name: string;
  logo: string;
  rpcUrl: string;
  primaryAccountFactory: string;
  entrypointAddress: string;
};

export const mainnetChains: ChainOption[] = [
  {
    id: '100',
    name: 'Gnosis',
    logo: '/chainLogo/Gnosis.png',
    rpcUrl: process.env.GNOSIS_RPC_URL || '',
    primaryAccountFactory: '0xBABCf159c4e3186cf48e4a48bC0AeC17CF9d90FE',
    entrypointAddress: '0xAAEb9DC18aDadae9b3aE7ec2b47842565A81113f'
  },
  {
    id: '42220',
    name: 'Celo',
    logo: '/chainLogo/Celo.png',
    rpcUrl: process.env.CELO_RPC_URL || '',
    primaryAccountFactory: '0xcd8b1B9E760148c5026Bc5B0D56a5374e301FDcA',
    entrypointAddress: '0x66fE9c22CcA49B257dd4F00508AC90198d99Bf27'
  },
  {
    id: '42161',
    name: 'Arbitrum',
    logo: '/chainLogo/Arbitrum.png',
    rpcUrl: process.env.ARBITRUM_RPC_URL || '',
    primaryAccountFactory: '0x0000000000000000000000000000000000000000',
    entrypointAddress: '0x0000000000000000000000000000000000000000'
  },
  {
    id: '137',
    name: 'Polygon',
    logo: '/chainLogo/Polygon.png',
    rpcUrl: process.env.POLYGON_RPC_URL || '',
    primaryAccountFactory: '0x940Cbb155161dc0C4aade27a4826a16Ed8ca0cb2',
    entrypointAddress: '0x7079253c0358eF9Fd87E16488299Ef6e06F403B6'
  },
  {
    id: '8453',
    name: 'Base',
    logo: '/chainLogo/Base.png',
    rpcUrl: process.env.BASE_RPC_URL || '',
    primaryAccountFactory: '0x05e2Fb34b4548990F96B3ba422eA3EF49D5dAa99',
    entrypointAddress: '0xAE76B1C6818c1DD81E20ccefD3e72B773068ABc9'
  }
];

export const testnetChains: ChainOption[] = [
  {
    id: '10200',
    name: 'Gnosis Testnet',
    logo: '/chainLogo/Gnosis.png',
    rpcUrl: process.env.GNOSIS_CHIADO_RPC_URL || '',
    // TODO: add chiado values
    primaryAccountFactory: '0x0000000000000000000000000000000000000000',
    entrypointAddress: '0x0000000000000000000000000000000000000000'
  }
];

export const chains: ChainOption[] = [...mainnetChains, ...testnetChains];

export const getRpcUrlOfChain = (chainId: string) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }

  if (!chain.rpcUrl) {
    throw new Error(`RPC URL not configured for chain ${chainId}`);
  }

  return chain.rpcUrl;
};

export const getPrimaryAccountFactoryOfChain = (chainId: string) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }
  return chain.primaryAccountFactory;
};

export const getEntrypointAddressOfChain = (chainId: string) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }
  return chain.entrypointAddress;
};
