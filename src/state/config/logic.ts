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
  SessionService,
} from "@citizenwallet/sdk";
import { isValidUrl } from "@/utils/url";
import { generateKey } from "@/utils/random";
import { ConfigureResponse } from "@/app/api/configure/route";

class ConfigLogic {
  store: StoreApi<ConfigStore>;
  baseUrl: string =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_PATH || ""
      : "";
  constructor() {
    this.store = useConfigStore;
  }

  setStep(step: ConfigStep) {
    this.store.setState({ step });
  }

  updatePrimaryColor(color: string) {
    this.store.setState({ primaryColor: color });
  }

  async imageUpload(logo: string): Promise<boolean> {
    try {
      // Fetch the Object URL
      const logoResponse = await fetch(logo);

      // Convert the response to a Blob
      const logoBlob = await logoResponse.blob();

      // Create a new FormData instance
      const logoData = new FormData();

      // Append the file to the FormData instance
      logoData.append("file", logoBlob, "logo.svg");

      // Send the FormData with fetch
      await fetch(`${this.baseUrl}/api/assets`, {
        method: "POST",
        body: logoData,
      });

      return true;
    } catch (error) {
      console.error("Error:", error);
    }

    return false;
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
    tokenAddress: string,
    checkoutService: SessionService
  ): Promise<boolean> {
    try {
      this.store.getState().deployRequest();

      // deploy community
      const tx = await factoryService.create(owner, tokenAddress, 0);

      await tx.wait();

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

      // upload community logo to next asset folder
      const logo = community.logo;

      const success = await this.imageUpload(logo);
      if (!success) {
        throw new Error("Failed to upload image");
      }

      const protocol = window.location.protocol;
      const baseUrl = window.location.host;

      community.logo = `${protocol}//${baseUrl}/assets/logo.svg`;

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

      const indexerUrl = `${protocol}//${baseUrl}/indexer`;
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

      // TODO: transfer partial checkout balance out to sponsor

      // TODO: transfer remainder to cw

      // TODO: remove this when the above is implemented
      await checkoutService.refund();

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
