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
import 'server-only';

import {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient
} from '@supabase/supabase-js';

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

export const getEventsByChainId = async (args: {
  client: SupabaseClient;
  chainId: string;
  alias: string;
}): Promise<PostgrestResponse<Event>> => {
  const { client, chainId, alias } = args;
  return client
    .from(TABLE_NAME + chainId)
    .select(`*`)
    .eq('alias', alias);
};

export const getEventByContractAndTopic = async (args: {
  client: SupabaseClient;
  chainId: string;
  contract: string;
  topic?: string | null;
  alias: string;
}): Promise<PostgrestSingleResponse<Event>> => {
  const { client, chainId, contract, topic, alias } = args;
  return client
    .from(TABLE_NAME + chainId)
    .select(`*`)
    .eq('contract', contract)
    .eq('topic', topic)
    .eq('alias', alias)
    .single();
};
