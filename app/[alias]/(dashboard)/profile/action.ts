'use server';

import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { uploadImage } from '@/services/storage';
import { getServiceRoleClient } from '@/services/top-db';
import { updateCommunityJson } from '@/services/top-db/community';
import { Config } from '@citizenwallet/sdk';
import { revalidatePath } from 'next/cache';

export async function uploadItemImageAction(imageFile: File, alias: string) {
  const client = getServiceRoleClient();

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias
  });

  const roleInApp = await getAuthUserRoleInAppAction();

  if (!roleInApp) {
    throw new Error('Unauthenticated user');
  }

  if (roleInApp === 'user' && !roleInCommunity) {
    throw new Error('You are not a member of this community');
  }

  try {
    // Upload the image to storage
    const imageUrl = await uploadImage(client, imageFile, alias);

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function updateProfileAction(data: Config, alias: string) {
  const client = getServiceRoleClient();

  const roleInCommunity = await getAuthUserRoleInCommunityAction({
    alias
  });

  const roleInApp = await getAuthUserRoleInAppAction();

  if (!roleInApp) {
    throw new Error('Unauthenticated user');
  }

  if (roleInApp === 'user' && !roleInCommunity) {
    throw new Error('You are not a member of this community');
  }

  try {
    // Update the profile in the database
    const { data: updatedData, error } = await updateCommunityJson(
      client,
      alias,
      data
    );

    if (error) {
      throw new Error('Failed to update profile');
    }
    revalidatePath(`/${alias}/profile`, 'page');
    return updatedData;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
}
