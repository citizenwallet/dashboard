import { ethers } from "ethers";
import { ERC20Service } from "./erc20";
import { PaymasterService } from "./paymaster";

export class EthService {
  private provider: ethers.JsonRpcProvider;

  constructor(rpc: string) {
    this.provider = new ethers.JsonRpcProvider(rpc);
  }

  getProvider() {
    return this.provider;
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
}
