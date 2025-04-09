import 'server-only';

import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';

const TABLE_NAME = 'a_members';
export const PAGE_SIZE = 25;

export interface MemberT {
  id: string;
  account: string;
  profile_contract: string;
  username: string;
  name: string;
  description: string;
  image: string;
  image_medium: string;
  image_small: string;
  token_id: string | null;
  created_at: Date;
  updated_at: Date;
}

// used in paginated tables
export const getMembers = async (args: {
  client: SupabaseClient;
  profileContract: string;
  query: string;
  page: number;
}): Promise<PostgrestResponse<MemberT>> => {
  const { client, profileContract, query, page } = args;

  const offset = (page - 1) * PAGE_SIZE;
  const searchQuery = query.trim().toLowerCase();

  let queryBuilder = client
    .from(TABLE_NAME)
    .select(`*`, { count: 'exact' })
    .ilike('profile_contract', profileContract);

  if (searchQuery) {
    queryBuilder = queryBuilder.or(
      `account.ilike.*${searchQuery}*,username.ilike.*${searchQuery}*,name.ilike.*${searchQuery}*,description.ilike.*${searchQuery}*`
    );
  }

  return queryBuilder
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)
    .limit(PAGE_SIZE);
};

export const searchMembers = async (args: {
  client: SupabaseClient;
  profileContract: string;
  query: string;
}): Promise<PostgrestResponse<MemberT>> => {
  const { client, profileContract, query } = args;

  const searchQuery = query.trim().toLowerCase();

  let queryBuilder = client
    .from(TABLE_NAME)
    .select(`*`, { count: 'exact' })
    .ilike('profile_contract', profileContract);

  if (searchQuery) {
    queryBuilder = queryBuilder.or(
      `account.ilike.*${searchQuery}*,username.ilike.*${searchQuery}*,name.ilike.*${searchQuery}*,description.ilike.*${searchQuery}*`
    );
  }

  return queryBuilder;
};

export const getMemberByAccount = async (args: {
  client: SupabaseClient;
  account: string;
  profileContract: string;
}) => {
  const { client, account, profileContract } = args;
  const queryBuilder = client
    .from(TABLE_NAME)
    .select(`*`)
    .ilike('profile_contract', profileContract)
    .eq('account', account)
    .single();

  return queryBuilder;
};
