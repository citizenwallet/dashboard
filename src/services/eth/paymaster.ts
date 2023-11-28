import { ethers } from "ethers";

export class PaymasterService {
  private provider: ethers.JsonRpcProvider;
  private address: string;

  constructor(rpc: ethers.JsonRpcProvider, address: string) {
    this.provider = rpc;
    this.address = address;
  }

  async getSponsor() {
    const abi = ["function sponsor() public view returns (address)"];

    const contract = new ethers.Contract(this.address, abi, this.provider);

    const sponsorAddress = await contract.sponsor();

    return sponsorAddress;
  }
}
