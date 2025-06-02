'use server';

import { generateRandomString } from '@/helpers/formatting';
import { getServiceRoleClient } from '@/services/top-db';
import { uniqueSlugCommunity } from '@/services/top-db/community';

export const generateUniqueSlugAction = async (baseSlug: string) => {
  let slug = baseSlug;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const client = getServiceRoleClient();

    const { data, error } = await uniqueSlugCommunity(client, slug);

    if (error && error.code !== 'PGRST116') {
      throw new Error('Error checking slug uniqueness');
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${generateRandomString(4)}`;
    attempts++;
  }

  throw new Error('Unable to generate unique slug after max attempts');
};

export const checkAliasAction = async (alias: string) => {
  const client = getServiceRoleClient();

  const { data, error } = await uniqueSlugCommunity(client, alias);

  if (error && error.code !== 'PGRST116') {
    throw new Error('Error checking alias availability');
  }
  return !data;
};
