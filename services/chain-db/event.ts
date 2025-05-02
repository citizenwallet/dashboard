import 'server-only';

import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';

const TABLE_NAME = 't_events_';

export interface Event {
  id: string;
  name: string;
  contract: string;
  event_signature: string;
  topic: string;
  alias: string;
  created_at: Date;
  updated_at: Date;
}

export const getEvents = async (args: {
  client: SupabaseClient;
  chainId: string;
  alias: string;
}): Promise<PostgrestResponse<Event>> => {
  const { client, chainId, alias } = args;
  return client.from(TABLE_NAME + chainId).select(`*`).eq('alias', alias);
};
