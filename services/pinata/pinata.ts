import 'server-only';

export const pinFileToIPFS = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.PINATA_BASE_URL}/pinning/pinFileToIPFS`,
      {
        method: 'POST',
        body: formData,
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY as string,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY as string
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to upload to IPFS: ${error}`);
  }
};

export const pinJSONToIPFS = async (json: any) => {
  try {
    const response = await fetch(
      `${process.env.PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: process.env.PINATA_API_KEY as string,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY as string
        },
        body: JSON.stringify(json)
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to pin JSON to IPFS: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to pin JSON to IPFS: ${error}`);
  }
};

export const unpin = async (hash: string) => {
  try {
    const response = await fetch(
      `${process.env.PINATA_BASE_URL}/pinning/unpin/${hash}`,
      {
        method: 'DELETE',
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY as string,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY as string
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to unpin: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Failed to unpin: ${error}`);
  }
};
