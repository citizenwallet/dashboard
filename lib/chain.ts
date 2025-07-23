export type ChainOption = {
  id: string;
  name: string;
  logo: string;
  rpcUrl: string;
};

if (!process.env.POLYGON_RPC_URL) {
  throw new Error('POLYGON_RPC_URL is not set');
}

if (!process.env.BASE_RPC_URL) {
  throw new Error('BASE_RPC_URL is not set');
}

if (!process.env.CELO_RPC_URL) {
  throw new Error('CELO_RPC_URL is not set');
}

if (!process.env.GNOSIS_RPC_URL) {
  throw new Error('GNOSIS_RPC_URL is not set');
}

if (!process.env.ARBITRUM_RPC_URL) {
  throw new Error('ARBITRUM_RPC_URL is not set');
}

if (!process.env.GNOSIS_CHIADO_RPC_URL) {
  throw new Error('GNOSIS_CHIADO_RPC_URL is not set');
}

export const mainnetChains: ChainOption[] = [
  {
    id: '100',
    name: 'Gnosis',
    logo: '/chainLogo/Gnosis.png',
    rpcUrl: process.env.GNOSIS_RPC_URL
  },
  {
    id: '42220',
    name: 'Celo',
    logo: '/chainLogo/Celo.png',
    rpcUrl: process.env.CELO_RPC_URL
  },
  {
    id: '42161',
    name: 'Arbitrum',
    logo: '/chainLogo/Arbitrum.png',
    rpcUrl: process.env.ARBITRUM_RPC_URL
  },
  {
    id: '137',
    name: 'Polygon',
    logo: '/chainLogo/Polygon.png',
    rpcUrl: process.env.POLYGON_RPC_URL
  },
  {
    id: '8453',
    name: 'Base',
    logo: '/chainLogo/Base.png',
    rpcUrl: process.env.BASE_RPC_URL
  }
];

export const testnetChains: ChainOption[] = [
  {
    id: '10200',
    name: 'Gnosis Testnet',
    logo: '/chainLogo/Gnosis.png',
    rpcUrl: process.env.GNOSIS_CHIADO_RPC_URL
  }
];

export const chains: ChainOption[] = [...mainnetChains, ...testnetChains]

export const getRpcUrlOfChain = (chainId: string) => {
  const chain = chains.find(chain => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }
  return chain.rpcUrl;
};
