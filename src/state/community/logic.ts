import { EthService } from "@/services/eth";
import { ERC20Service } from "@/services/eth/erc20";
import { PaymasterService } from "@/services/eth/paymaster";

class CommunityLogic {
  private ethService: EthService;
  private erc20Service: ERC20Service;
  private paymasterService: PaymasterService;

  constructor(rpc: string, tokenAddress: string, paymasterAddress: string) {
    this.ethService = new EthService(rpc);
    this.erc20Service = this.ethService.getERC20Service(tokenAddress);
    this.paymasterService =
      this.ethService.getPaymasterService(paymasterAddress);
  }

  async fetchSponsorAddress(): Promise<string> {
    return await this.paymasterService.getSponsor();
  }

  async fetchBalance(sponsor: string): Promise<string> {
    try {
      return await this.ethService.getBalance(sponsor);
    } catch (_) {}

    return "0.0";
  }

  async fetchChainInfo() {
    return await this.ethService.getChainInfo();
  }
}

export default CommunityLogic;
