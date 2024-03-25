import { StoreApi } from "zustand";
import { ConfigStep, ConfigStore, useConfigStore } from "./state";
import { useMemo } from "react";
import {
  CommunityFactoryContractService,
  Config,
  ConfigCommunity,
  ConfigERC4337,
  ConfigIPFS,
  ConfigIndexer,
  ConfigNode,
  ConfigProfile,
  ConfigScan,
  ConfigToken,
  Network,
} from "@citizenwallet/sdk";
import { isValidUrl } from "@/utils/url";
import { generateKey } from "@/utils/random";
import { writeCommunityFile } from "@/services/community";
import { ConfigureResponse } from "@/app/api/configure/route";

class ConfigLogic {
  store: StoreApi<ConfigStore>;
  constructor() {
    this.store = useConfigStore;
  }

  setStep(step: ConfigStep) {
    this.store.setState({ step });
  }

  updatePrimaryColor(color: string) {
    this.store.setState({ primaryColor: color });
  }

  selectNetwork(network: Network) {
    const scan: ConfigScan = {
      url: network.explorer,
      name: `${network.name} Explorer`,
    };
    const node: ConfigNode = {
      url: network.rpcUrl,
      ws_url: network.wsRpcUrl,
      chain_id: network.chainId,
    };
    this.store.getState().chainContinue(network, scan, node);
  }

  communityContinue(
    name: string,
    description: string,
    url: string,
    tokenAddress: string,
    metadata: {
      symbol: string;
      name: string;
      decimals: bigint;
    },
    file: string,
    primaryColor?: string
  ) {
    const isValid = isValidUrl(url);
    if (!isValid) {
      this.store.getState().setInvalidUrl(true);
      return;
    }

    this.store.getState().setInvalidUrl(false);

    const alias = window.location.hostname;

    const primary =
      primaryColor ||
      process.env.NEXT_PUBLIC_COMMUNITY_THEME_PRIMARY_COLOR ||
      "#000000";

    const community: ConfigCommunity = {
      name,
      description,
      url,
      alias,
      custom_domain: alias,
      logo: file,
      theme: {
        primary,
      },
    };

    const token: ConfigToken = {
      standard: "erc20",
      name: metadata.name,
      address: tokenAddress,
      symbol: metadata.symbol,
      decimals: Number(metadata.decimals),
    };
    this.store.getState().communityContinue(community, token);
  }

  async deploy(
    owner: string,
    factoryService: CommunityFactoryContractService,
    tokenAddress: string
  ): Promise<boolean> {
    try {
      this.store.getState().deployRequest();

      // deploy community
      //   const tx = await factoryService.create(owner, tokenAddress, 0);

      //   await tx.wait();

      const [
        tokenEntryPointAddress,
        paymasterAddress,
        accountFactoryAddress,
        profileAddress,
      ] = await factoryService.get(owner, tokenAddress, 0);

      const community = this.store.getState().community;
      if (!community) {
        throw new Error("Community not found");
      }

      const token = this.store.getState().token;
      if (!token) {
        throw new Error("Token not found");
      }

      const scan = this.store.getState().scan;
      if (!scan) {
        throw new Error("Scan not found");
      }

      const node = this.store.getState().node;
      if (!node) {
        throw new Error("Node not found");
      }

      const ipfsUrl = process.env.NEXT_PUBLIC_IPFS_CDN_URL;
      if (!ipfsUrl) {
        throw new Error("IPFS URL not found");
      }
      const ipfs: ConfigIPFS = {
        url: ipfsUrl,
      };

      const profile: ConfigProfile = {
        address: profileAddress,
      };

      const indexerUrl = `${window.location.protocol}//${window.location.host}/indexer`;
      const indexer: ConfigIndexer = {
        url: indexerUrl,
        ipfs_url: indexerUrl,
        key: generateKey(),
      };

      const erc4337: ConfigERC4337 = {
        rpc_url: `${indexerUrl}/rpc`,
        paymaster_rpc_url: `${indexerUrl}/rpc`,
        entrypoint_address: tokenEntryPointAddress,
        paymaster_address: paymasterAddress,
        account_factory_address: accountFactoryAddress,
        paymaster_type: "cw",
      };

      const config: Config = {
        community,
        token,
        scan,
        node,
        ipfs,
        profile,
        indexer,
        erc4337,
        version: 1,
      };

      console.log(config);
      const response = await fetch("/dashboard/api/configure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Failed to deploy");
      }

      const { hash } = (await response.json()) as ConfigureResponse;

      console.log("hash", hash);
      // transfer partial checkout balance out to sponsor

      // transfer remainder to cw

      this.store.getState().deploySuccess();

      return true;
    } catch (e) {
      console.error(e);
      this.store.getState().deployFailed();
    }

    return false;
  }
}

export const useConfigLogic = () => {
  const logic = useMemo(() => new ConfigLogic(), []);

  return logic;
};
