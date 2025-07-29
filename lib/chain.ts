export type ChainOption = {
  id: string;
  name: string;
  logo: string;
  rpcUrl: string;
  primaryAccountFactory: string;
  entrypointAddress: string;
  primaryCardManager: string;
  sessionModuleAddress: string;
  sessionFactoryAddress: string;
  sessionProviderAddress: string;
};

export const mainnetChains: ChainOption[] = [
  {
    id: '100',
    name: 'Gnosis',
    logo: '/chainLogo/Gnosis.png',
    rpcUrl: process.env.GNOSIS_RPC_URL || '',

    primaryAccountFactory: '0xBABCf159c4e3186cf48e4a48bC0AeC17CF9d90FE',
    entrypointAddress: '0xAAEb9DC18aDadae9b3aE7ec2b47842565A81113f',

    primaryCardManager: '0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28',

    sessionModuleAddress: '0xE2F3DC3E638113b9496060349e5332963d9C1152',
    sessionFactoryAddress: '0xEd0cD3886b84369A0e29Db9a4480ADF5051c76C9',
    sessionProviderAddress: '0xF3004A1690f97Cf5d307eDc5958a7F76b62f9FC9'
  },
  {
    id: '42220',
    name: 'Celo',
    logo: '/chainLogo/Celo.png',
    rpcUrl: process.env.CELO_RPC_URL || '',
    primaryAccountFactory: '0xcd8b1B9E760148c5026Bc5B0D56a5374e301FDcA',
    entrypointAddress: '0x66fE9c22CcA49B257dd4F00508AC90198d99Bf27',
    primaryCardManager: '0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28',
    sessionModuleAddress: '0xE2F3DC3E638113b9496060349e5332963d9C1152',
    sessionFactoryAddress: '0xEd0cD3886b84369A0e29Db9a4480ADF5051c76C9',
    sessionProviderAddress: '0xF3004A1690f97Cf5d307eDc5958a7F76b62f9FC9'
  },
  {
    id: '42161',
    name: 'Arbitrum',
    logo: '/chainLogo/Arbitrum.png',
    rpcUrl: process.env.ARBITRUM_RPC_URL || '',
    primaryAccountFactory: '0x0000000000000000000000000000000000000000',
    entrypointAddress: '0x0000000000000000000000000000000000000000',
    primaryCardManager: '0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28',
    sessionModuleAddress: '0xE2F3DC3E638113b9496060349e5332963d9C1152',
    sessionFactoryAddress: '0xEd0cD3886b84369A0e29Db9a4480ADF5051c76C9',
    sessionProviderAddress: '0xF3004A1690f97Cf5d307eDc5958a7F76b62f9FC9'
  },
  {
    id: '137',
    name: 'Polygon',
    logo: '/chainLogo/Polygon.png',
    rpcUrl: process.env.POLYGON_RPC_URL || '',
    primaryAccountFactory: '0x940Cbb155161dc0C4aade27a4826a16Ed8ca0cb2',
    entrypointAddress: '0x7079253c0358eF9Fd87E16488299Ef6e06F403B6',
    primaryCardManager: '0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28',
    sessionModuleAddress: '0xE2F3DC3E638113b9496060349e5332963d9C1152',
    sessionFactoryAddress: '0xEd0cD3886b84369A0e29Db9a4480ADF5051c76C9',
    sessionProviderAddress: '0xF3004A1690f97Cf5d307eDc5958a7F76b62f9FC9'
  },
  {
    id: '8453',
    name: 'Base',
    logo: '/chainLogo/Base.png',
    rpcUrl: process.env.BASE_RPC_URL || '',

    primaryAccountFactory: '0x05e2Fb34b4548990F96B3ba422eA3EF49D5dAa99',
    entrypointAddress: '0xAE76B1C6818c1DD81E20ccefD3e72B773068ABc9',

    primaryCardManager: '0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28',

    sessionModuleAddress: '0xE2F3DC3E638113b9496060349e5332963d9C1152',
    sessionFactoryAddress: '0xEd0cD3886b84369A0e29Db9a4480ADF5051c76C9',
    sessionProviderAddress: '0xF3004A1690f97Cf5d307eDc5958a7F76b62f9FC9'
  }
];

export const testnetChains: ChainOption[] = [
  {
    id: '10200',
    name: 'Gnosis Testnet',
    logo: '/chainLogo/Gnosis.png',
    rpcUrl: process.env.GNOSIS_CHIADO_RPC_URL || '',

    primaryAccountFactory: '0xabb0B1f80E854266bCF0e3107485238b16e777Bb',
    entrypointAddress: '0x7079253c0358eF9Fd87E16488299Ef6e06F403B6',

    primaryCardManager: '0x1D7546BA232Bd5A0A240f2962d5a3f622aBB56F1',

    sessionModuleAddress: '0x38819D2D05C6cAaB38B1C16F944acC9E023E010f',
    sessionFactoryAddress: '0x31de0ED701DC3Ac3705bAa2F3A9843aeAC86F8A4',
    sessionProviderAddress: '0x7E72d41A95659257cdED8f8F361742f72396b0fB'
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

export const getPrimaryCardManagerOfChain = (chainId: string) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }
  return chain.primaryCardManager;
};

export const getSessionModuleAddressOfChain = (chainId: string) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }
  return chain.sessionModuleAddress;
};

export const getSessionFactoryAddressOfChain = (chainId: string) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }
  return chain.sessionFactoryAddress;
};

export const getSessionProviderAddressOfChain = (chainId: string) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }
  return chain.sessionProviderAddress;
};
