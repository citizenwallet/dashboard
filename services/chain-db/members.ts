import 'server-only';

import {
  SupabaseClient,
  PostgrestResponse,
  PostgrestSingleResponse
} from '@supabase/supabase-js';
import { Profile } from '@/app/[alias]/(dashboard)/members/[account]/action';

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
  showAllMembers: boolean;
}): Promise<PostgrestResponse<MemberT>> => {
  const { client, profileContract, query, page, showAllMembers } = args;

  const offset = (page - 1) * PAGE_SIZE;
  const searchQuery = query.trim().toLowerCase();

  let queryBuilder = client
    .from(TABLE_NAME)
    .select(`*`, { count: 'exact' })
    .ilike('profile_contract', profileContract);

  if (!showAllMembers) {
    queryBuilder = queryBuilder.not('username', 'ilike', '%anonymous%');
  }

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
}): Promise<PostgrestSingleResponse<MemberT>> => {
  const { client, account, profileContract } = args;
  const queryBuilder = client
    .from(TABLE_NAME)
    .select(`*`)
    .ilike('profile_contract', profileContract)
    .eq('account', account)
    .maybeSingle();

  return queryBuilder;
};

export const removeMember = async (args: {
  client: SupabaseClient;
  account: string;
  profileContract: string;
}) => {
  const { client, account, profileContract } = args;
  const queryBuilder = client
    .from(TABLE_NAME)
    .update({
      username: 'anonymous',
      name: 'Anonymous',
      description: 'This user does not have a profile',
      image: 'ipfs://QmeuAaXrJBHygzAEHnvw5AKUHfBasuavsX9fU69rdv4mhh',
      image_medium: 'ipfs://QmeuAaXrJBHygzAEHnvw5AKUHfBasuavsX9fU69rdv4mhh',
      image_small: 'ipfs://QmeuAaXrJBHygzAEHnvw5AKUHfBasuavsX9fU69rdv4mhh'
    })
    .ilike('profile_contract', profileContract)
    .eq('account', account)
    .single();

  return queryBuilder;
};

export const updateMember = async (args: {
  client: SupabaseClient;
  account: string;
  profileContract: string;
  profile: Profile;
}) => {
  const { client, account, profileContract, profile } = args;
  const queryBuilder = client
    .from(TABLE_NAME)
    .update({
      username: profile.username,
      name: profile.name,
      description: profile.description,
      image: profile.image,
      image_medium: profile.image_medium,
      image_small: profile.image_small
    })
    .ilike('profile_contract', profileContract)
    .eq('account', account)
    .single();

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
  page: number;
}) => {
  const { client, contractAddress, page } = args;
  const offset = (page - 1) * PAGE_SIZE;

  // Fetch roles
  const {
    data: roles,
    error: rolesError,
    count: rolesCount
  } = await client
    .from('a_roles')
    .select('*', { count: 'exact' })
    .ilike('contract_address', contractAddress)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)
    .limit(PAGE_SIZE);

  if (rolesError) {
    return { data: null, error: rolesError };
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

  return { data: combined, count: rolesCount };
};
