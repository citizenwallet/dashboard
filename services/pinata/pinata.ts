import { Profile } from '@/app/[alias]/(dashboard)/members/[account]/action';
import 'server-only';

export const pinFileToIPFS = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${process.env.PINATA_BASE_URL}/pinning/pinFileToIPFS`,
    {
      method: 'POST',
      body: formData,
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY || '',
        pinata_secret_api_key: process.env.PINATA_API_SECRET || ''
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Pinata upload failed:', errorText);
    throw new Error(`Failed to pin file to IPFS: ${response.statusText}`);
  }

  return await response.json();
};

export const pinJSONToIPFS = async (json: Profile) => {
  try {
    const response = await fetch(
      `${process.env.PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: process.env.PINATA_API_KEY as string,
          pinata_secret_api_key: process.env.PINATA_API_SECRET as string
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
          pinata_secret_api_key: process.env.PINATA_API_SECRET as string
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
