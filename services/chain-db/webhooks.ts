import 'server-only';

import {
  SupabaseClient,
  PostgrestResponse,
  PostgrestSingleResponse
} from '@supabase/supabase-js';

const TABLE_NAME = 'webhooks';
export const PAGE_SIZE = 25;

export interface Webhook {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  url: string;
  event_contract: string;
  event_topic: string;
}

export type CreateWebhook = Pick<Webhook, 'name' | 'url' | 'event_topic'>;

// used in paginated tables
export const getWebhooks = async (args: {
  client: SupabaseClient;
  query: string;
  page: number;
}): Promise<PostgrestResponse<Webhook>> => {
  const { client, query, page } = args;

  const offset = (page - 1) * PAGE_SIZE;
  const searchQuery = query.trim().toLowerCase();

  let queryBuilder = client.from(TABLE_NAME).select(`*`, { count: 'exact' });

  if (searchQuery) {
    queryBuilder = queryBuilder.or(
      `name.ilike.*${searchQuery}*,url.ilike.*${searchQuery}*,event_contract.ilike.*${searchQuery}*,event_topic.ilike.*${searchQuery}*`
    );
  }

  return queryBuilder
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)
    .limit(PAGE_SIZE);
};

export const createWebhook = async (args: {
  client: SupabaseClient;
  webhook: CreateWebhook;
}): Promise<PostgrestSingleResponse<Webhook>> => {
  const { client, webhook } = args;

  return client.from(TABLE_NAME).insert(webhook).select().single();
};

export const deleteWebhook = async (args: {
  client: SupabaseClient;
  id: string;
}): Promise<PostgrestSingleResponse<Webhook>> => {
  const { client, id } = args;
  return client.from(TABLE_NAME).delete().eq('id', id).select().single();
};

export const getWebhookSecret = async (args: {
  client: SupabaseClient;
  alias: string;
}): Promise<PostgrestSingleResponse<{ secret: string }>> => {
  const { client, alias } = args;
  return client
    .from('webhook_secrets')
    .select('secret')
    .eq('alias', alias)
    .single();
};
