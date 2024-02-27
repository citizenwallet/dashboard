interface Network {
  name: string;
  symbol: string;
  explorer: string;
}

interface Networks {
  [key: string]: Network;
}

export const NETWORKS: Networks = {
  "137": {
    name: "Polygon",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
  },
  "8453": {
    name: "Base",
    symbol: "Ether",
    explorer: "https://basescan.org/",
  },
  "80001": {
    name: "Polygon Mumbai",
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
  },
  "42220": {
    name: "CELO",
    symbol: "CELO",
    explorer: "https://celoscan.io",
  },
  "44787": {
    name: "CELO Alfajores",
    symbol: "CELO",
    explorer: "https://alfajores.celoscan.io",
  },
};
