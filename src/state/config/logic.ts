import { StoreApi } from "zustand";
import { ConfigStep, ConfigStore, useConfigStore } from "./state";
import { useMemo } from "react";
import {
  CommunityFactoryContractService,
  ConfigCommunity,
  ConfigNode,
  ConfigScan,
  ConfigToken,
  Network,
} from "@citizenwallet/sdk";
import { isValidUrl } from "@/utils/url";

class ConfigLogic {
  store: StoreApi<ConfigStore>;
  constructor() {
    this.store = useConfigStore;
  }

  setStep(step: ConfigStep) {
    this.store.setState({ step });
  }

  selectNetwork(network: Network) {
    const scan: ConfigScan = { url: "", name: "" };
    const node: ConfigNode = { url: "", ws_url: "", chain_id: 0 };
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
      decimals: number;
    },
    file: string
  ) {
    const isValid = isValidUrl(url);
    if (!isValid) {
      this.store.getState().setInvalidUrl(true);
      return;
    }

    this.store.getState().setInvalidUrl(false);

    const alias = window.location.hostname;

    const community: ConfigCommunity = {
      name,
      description,
      url,
      alias,
      custom_domain: alias,
      logo: file,
    };

    const token: ConfigToken = {
      standard: "erc20",
      name: metadata.name,
      address: tokenAddress,
      symbol: metadata.symbol,
      decimals: metadata.decimals,
    };
    this.store.getState().communityContinue(community, token);
  }

  async deploy(
    owner: string,
    network: Network,
    factoryService: CommunityFactoryContractService
  ) {
    try {
      this.store.getState().deployRequest();

      const tx = await factoryService.create(owner, "", 0);

      await tx.wait();

      const communityAddress = await factoryService.get(owner, "", 0);

      this.store.getState().deploySuccess();
    } catch (e) {
      console.error(e);
      this.store.getState().deployFailed();
    }
  }
}

export const useConfigLogic = () => {
  const logic = useMemo(() => new ConfigLogic(), []);

  return logic;
};
