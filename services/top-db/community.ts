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

export const getCommunitiesByChainId = async (
  client: SupabaseClient,
  chainId?: number
): Promise<PostgrestResponse<CommunityT>> => {
  let query = client
    .from('communities')
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
    .from('communities')
    .select('*')
    .eq('alias', alias)
    .eq('active', true)
    .single();
};
