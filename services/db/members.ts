import 'server-only';

import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';

const TABLE_NAME = 'a_members';
const PAGE_SIZE = 10;

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

export const getMembers = async (args: {
  client: SupabaseClient;
  profile_contract: string;
  query: string;
  page: number;
}): Promise<PostgrestResponse<MemberT>> => {
  const { client, profile_contract, query, page } = args;

  const offset = (page - 1) * PAGE_SIZE;
  const searchQuery = query.trim().toLowerCase();

  let queryBuilder = client
    .from(TABLE_NAME)
    .select(`*`, { count: 'exact' })
    .ilike('profile_contract', profile_contract);

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
