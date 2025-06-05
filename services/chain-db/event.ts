import 'server-only';

import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

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

export const insertEvent = async (args: {
  client: SupabaseClient;
  chainId: string;
  event: Pick<
    Event,
    'name' | 'contract' | 'event_signature' | 'topic' | 'alias'
  >;
}): Promise<PostgrestSingleResponse<Event>> => {
  const { client, chainId, event } = args;
  return client
    .from(TABLE_NAME + chainId)
    .insert(event)
    .single();
};
