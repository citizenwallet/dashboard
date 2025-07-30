'use server';

import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';

export async function getCommunityByAliasAction(alias: string) {
  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  return data;
}