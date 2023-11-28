import { ethers } from "ethers";

export class ERC20Service {
  private provider: ethers.JsonRpcProvider;
  private address: string;

  constructor(rpc: ethers.JsonRpcProvider, address: string) {
    this.provider = rpc;
    this.address = address;
  }

  async getBalance(address: string) {
    const abi = ["function balanceOf(address owner) view returns (uint256)"];

    const contract = new ethers.Contract(this.address, abi, this.provider);

    const balance = await contract.balanceOf(address);

    return ethers.formatEther(balance);
  }
}
