'use server';

import { uploadImage } from '@/services/storage';
import { getServiceRoleClient } from '@/services/top-db';

export async function uploadItemImageAction(imageFile: File, alias: string) {
  const client = getServiceRoleClient();

  try {
    // Upload the image to storage
    const imageUrl = await uploadImage(client, imageFile, alias);

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
