import 'server-only';

import { Config } from '@citizenwallet/sdk';
import {
  PostgrestMaybeSingleResponse,
  PostgrestResponse,
  SupabaseClient
} from '@supabase/supabase-js';

export interface CommunityT {
  alias: string;
  chain_id: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  json: Config;
}

const TABLE_NAME = 'communities';
const LIMIT = 15;

export const getCommunitiesByChainId = async (
  client: SupabaseClient,
  chainId?: number
): Promise<PostgrestResponse<CommunityT>> => {
  let query = client
    .from(TABLE_NAME)
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (chainId) {
    query = query.eq('chain_id', chainId);
  }

  return await query;
};

export const getCommunityByAlias = async (
  client: SupabaseClient,
  alias: string
): Promise<PostgrestMaybeSingleResponse<CommunityT>> => {
  return await client
    .from(TABLE_NAME)
    .select('*')
    .eq('alias', alias)
    .eq('active', true)
    .single();
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
      .from(TABLE_NAME)
      .select('*', { count: 'exact' })
      .ilike('alias', `%${query}%`)
      .eq('active', true)
      .range(offset, offset + limit);
  }

  return await client
    .from(TABLE_NAME)
    .select('*', { count: 'exact' })
    .eq('active', true)
    .range(offset, offset + limit);
};
