import pinataSdk from "@pinata/sdk";

export const pinJson = async (data: any): Promise<string> => {
  const pinata = new pinataSdk(
    process.env.IPFS_API_KEY,
    process.env.IPFS_API_SECRET
  );

  const response = await pinata.pinJSONToIPFS(data);

  return response.IpfsHash;
};
