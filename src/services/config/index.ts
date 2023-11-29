import { ApiService } from "../api";

export interface Config {
  community: {
    name: string;
    description: string;
    url: string;
    alias: string;
    logo: string;
    customDomain?: string;
    hidden?: boolean;
  };
  scan: {
    url: string;
    name: string;
  };
  indexer: {
    url: string;
    ipfs_url: string;
    key: string;
  };
  ipfs: {
    url: string;
  };
  node: {
    url: string;
    ws_url: string;
  };
  erc4337: {
    rpc_url: string;
    paymaster_address?: string;
    entrypoint_address: string;
    account_factory_address: string;
    paymaster_rpc_url: string;
    paymaster_type: string;
    gas_extra_percentage?: number;
  };
  token: {
    standard: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  profile: {
    address: string;
  };
  plugins?: {
    name: string;
    icon: string;
    url: string;
  }[];
  version: number;
}

export class ConfigService {
  constructor(api: ApiService) {
    this.api = api;
  }

  api: ApiService;

  config?: Config[];

  cacheBuster() {
    return Math.floor(new Date().getTime() / 1000);
  }

  async setConfig() {
    this.config = await this.api.get(
      "communities.json?cacheBuster=" + this.cacheBuster()
    );
  }

  async get(): Promise<Config[]> {
    if (!this.config) {
      this.config = await this.api.get(
        "communities.json?cacheBuster=" + this.cacheBuster()
      );

      return this.config!;
    }

    this.setConfig();

    return this.config!;
  }
}
