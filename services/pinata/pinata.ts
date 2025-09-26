import { Profile } from '@citizenwallet/sdk';
import 'server-only';

export interface IPFSFile {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files: number;
  mime_type: string;
  group_id: string | null;
}

export interface IPFSResponse {
  data: IPFSFile;
}
export interface IPFSFilesResponse {
  data: {
    files: IPFSFile[];
  };
}

export const pinFileToIPFS = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('network', 'public');

    const response = await fetch(
      `${process.env.PINATA_UPLOADS_BASE_URL}/v3/files`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata upload failed:', errorText);
      throw new Error(`Failed to pin file to IPFS: ${response.statusText}`);
    }

    const data = (await response.json()) as IPFSResponse;
    return data.data.cid;
  } catch (error) {
    console.error('Pinata upload failed:', error);
  }

  return null;
};

export const pinJSONToIPFS = async (json: Profile) => {
  try {
    const formData = new FormData();

    const blob = new Blob([JSON.stringify(json)]);

    const file = new File([blob], `${json.username}.json`, {
      type: 'application/json'
    });
    formData.append('file', file);
    formData.append('network', 'public');

    const response = await fetch(
      `${process.env.PINATA_UPLOADS_BASE_URL}/v3/files`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to pin JSON to IPFS: ${response.statusText}`);
    }

    const data = (await response.json()) as IPFSResponse;
    return data.data.cid;
  } catch (error) {
    console.error('Pinata upload failed:', error);
  }

  return null;
};

export const unpin = async (hash: string) => {
  try {
    const url = `${process.env.PINATA_API_BASE_URL}/v3/files/public?cid=${hash}`;

    const fileResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      }
    });
    if (!fileResponse.ok) {
      throw new Error(`Failed to get file: ${fileResponse.statusText}`);
    }

    const data = (await fileResponse.json()) as IPFSFilesResponse;
    if (data.data.files.length === 0) {
      throw new Error(`File not found: ${hash}`);
    }

    const file = data.data.files[0];

    if (!file.id) {
      throw new Error(`File not found: ${hash}`);
    }

    const response = await fetch(
      `${process.env.PINATA_API_BASE_URL}/v3/files/public/${file.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to unpin: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error(`Failed to unpin: ${error}`);
  }

  return null;
};
