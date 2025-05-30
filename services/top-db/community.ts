import 'server-only';

import {
  SupabaseClient,
  PostgrestResponse,
  PostgrestMaybeSingleResponse
} from '@supabase/supabase-js';
import { Config } from '@citizenwallet/sdk';

export interface CommunityT {
  alias: string;
  chain_id: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  json: Config;
}

const LIMIT = 15;

export const getCommunityByAlias = async (
  client: SupabaseClient,
  alias: string
): Promise<PostgrestMaybeSingleResponse<CommunityT>> => {
  return await client
    .from('communities')
    .select('*')
    .eq('alias', alias)
    .eq('active', true)
    .single();
};

//it uses for the table
export const getCommunityByAliasList = async (
  client: SupabaseClient,
  aliasList: string[],
  query?: string,
  page: number = 1
): Promise<PostgrestResponse<CommunityT>> => {
  const limit = LIMIT;
  const offset = (page - 1) * limit;

  if (query) {
    return await client
      .from('communities')
      .select('*')
      .in('alias', aliasList)
      .eq('active', true)
      .range(offset, offset + limit);
  }

  return await client
    .from('communities')
    .select('*')
    .in('alias', aliasList)
    .eq('active', true)
    .range(offset, offset + limit);
};

//it uses for the table
export const getCommunities = async (
  client: SupabaseClient,
  query?: string,
  page: number = 1
): Promise<PostgrestResponse<CommunityT>> => {
  const limit = LIMIT;
  const offset = (page - 1) * limit;

  if (query) {
    return await client
      .from('communities')
      .select('*', { count: 'exact' })
      .ilike('alias', `%${query}%`)
      .eq('active', true)
      .range(offset, offset + limit);
  }

  return await client
    .from('communities')
    .select('*', { count: 'exact' })
    .eq('active', true)
    .range(offset, offset + limit);
};
