import 'server-only';

import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import { MemberT } from './members';

const TABLE_NAME = 'a_transfers';
const PAGE_SIZE = 10;

export interface TransferT {
  id: string;
  hash: string;
  from_member_id: string;
  to_member_id: string;
  token_contract: string;
  value: string;
  description: string;
  status: string;
  created_at: Date;
}

export interface TransferWithMembersT extends TransferT {
  from_member: MemberT;
  to_member: MemberT;
}

export const getTransfersOfToken = async (args: {
  client: SupabaseClient;
  token: string;
  query: string;
  page: number;
}): Promise<PostgrestResponse<TransferWithMembersT>> => {
  const { client, token, query, page } = args;

  const offset = (page - 1) * PAGE_SIZE;
  const searchQuery = query.trim();

  let queryBuilder = client
    .from(TABLE_NAME)
    .select(
      `
      *,
      from_member:a_members!from_member_id!inner(*),
      to_member:a_members!to_member_id!inner(*)
    `,
      { count: 'exact' }
    )
    .eq('token_contract', token)
    .eq('status', 'success');

  if (searchQuery) {
    queryBuilder = queryBuilder.or(
      `account.ilike.*${searchQuery}*,username.ilike.*${searchQuery}*,name.ilike.*${searchQuery}*,description.ilike.*${searchQuery}*`,
      { referencedTable: 'a_members' } // or 'a_members' if needed
    );
  }

  return queryBuilder
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)
    .limit(PAGE_SIZE);
};
