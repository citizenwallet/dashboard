import { ethers } from "ethers";
import { ERC20Service } from "./erc20";
import { PaymasterService } from "./paymaster";

import ChainList from "@/assets/data/chains.json";

export class EthService {
  private provider: ethers.JsonRpcProvider;

  constructor(rpc: string) {
    this.provider = new ethers.JsonRpcProvider(rpc);
  }

  getProvider() {
    return this.provider;
  }

  async getChainId() {
    const network = await this.provider.getNetwork();

    return network.chainId;
  }

  getERC20Service(address: string) {
    return new ERC20Service(this.provider, address);
  }
  getPaymasterService(address: string) {
    return new PaymasterService(this.provider, address);
  }

  async getBalance(address: string) {
    const balance = await this.provider.getBalance(address);

    return parseFloat(ethers.formatEther(balance)).toFixed(2);
  }

  async getChainInfo(): Promise<ChainInfo> {
    const chainId = await this.getChainId();

    const chainInfo = ChainList.find(
      (chain) => chain.chainId.toString() === chainId.toString()
    );

    if (!chainInfo) {
      throw new Error("Chain not found");
    }

    return chainInfo as ChainInfo;
  }
}
