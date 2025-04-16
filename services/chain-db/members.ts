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

export const getAllMembers = async (args: {
  client: SupabaseClient;
  profileContract: string;
}): Promise<PostgrestResponse<MemberT>> => {
  const { client, profileContract } = args;
  return client
    .from(TABLE_NAME)
    .select('*')
    .ilike('profile_contract', profileContract);
};

export const getMinterMembers = async (args: {
  client: SupabaseClient;
  contractAddress: string;
}) => {
  const { client, contractAddress } = args;

  // Fetch roles
  const {
    data: roles,
    error: rolesError,
    status: rolesStatus
  } = await client
    .from('a_roles')
    .select('*')
    .ilike('contract_address', contractAddress);

  if (rolesError) {
    return { data: null, error: rolesError, status: rolesStatus };
  }

  if (!roles?.length) {
    return { data: [], error: null, status: 200 };
  }

  const memberQueries = roles.map((role) =>
    client
      .from('a_members')
      .select('*')
      .ilike('account', role.account_address)
      .single()
  );

  const memberResults = await Promise.all(memberQueries);

  const memberMap: Record<string, MemberT> = {};
  memberResults.forEach(({ data: member, error }) => {
    if (member && !error) {
      memberMap[member.account.toLowerCase()] = member;
    }
  });

  const combined = roles.map((role) => ({
    ...role,
    a_member: memberMap[role.account_address.toLowerCase()] || null
  }));

  return { data: combined, count: combined.length };
};
