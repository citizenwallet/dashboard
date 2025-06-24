import 'server-only';

import {
  SupabaseClient,
  PostgrestResponse,
  PostgrestMaybeSingleResponse
} from '@supabase/supabase-js';

const USERS_TABLE_NAME = 'users';
const USERS_COMMUNITY_ACCESS_TABLE_NAME = 'users_community_access';

type UserRoleT = 'admin' | 'user'; // app level
export type CommunityAccessRoleT = 'owner' | 'member';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: UserRoleT;
  created_at: Date;
  last_active_at: Date;
}

export interface UserCommunityAccessT {
  id: number;
  user_id: number;
  alias: string;
  chain_id: number;
  role: CommunityAccessRoleT;
  created_at: Date;
  updated_at: Date;
}

export const getUserByEmail = async (args: {
  client: SupabaseClient;
  email: string;
}): Promise<
  PostgrestMaybeSingleResponse<
    UserRow & { users_community_access: UserCommunityAccessT[] }
  >
> => {
  const { client, email } = args;

  return client
    .from(USERS_TABLE_NAME)
    .select(
      `
      *,
      ${USERS_COMMUNITY_ACCESS_TABLE_NAME}!user_id(*)
    `
    )
    .eq('email', email)
    .maybeSingle();
};

export const addUserRowoApp = async (args: {
  client: SupabaseClient;
  data: Pick<UserRow, 'email' | 'name' | 'avatar'>;
}) => {
  const { client, data } = args;
  const { email, name, avatar } = data;

  return client
    .from(USERS_TABLE_NAME)
    .upsert({ email, name, avatar, role: 'user' }, { onConflict: 'email' })
    .select()
    .single();
};

export const addUserRowoCommunity = async (args: {
  client: SupabaseClient;
  data: Pick<UserCommunityAccessT, 'user_id' | 'chain_id' | 'alias' | 'role'>;
}) => {
  const { client, data } = args;
  const { user_id, chain_id, alias, role } = data;

  return client
    .from(USERS_COMMUNITY_ACCESS_TABLE_NAME)
    .upsert(
      {
        user_id,
        chain_id,
        alias,
        role,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id,chain_id,alias'
      }
    )
    .select()
    .single();
};

export const removeUserFromCommunity = async (args: {
  client: SupabaseClient;
  data: Pick<UserCommunityAccessT, 'alias' | 'user_id'>;
}) => {
  const { client, data } = args;
  const { alias, user_id } = data;

  return client
    .from(USERS_COMMUNITY_ACCESS_TABLE_NAME)
    .delete()
    .eq('user_id', user_id)
    .eq('alias', alias);
};

export const getUsersOfCommunity = async (args: {
  alias: string;
  client: SupabaseClient;
}): Promise<PostgrestResponse<UserCommunityAccessT & { user: UserRow }>> => {
  const { alias, client } = args;

  return client
    .from(USERS_COMMUNITY_ACCESS_TABLE_NAME)
    .select(
      `
      *,
      user:${USERS_TABLE_NAME}!user_id!inner(*)
    `,
      { count: 'exact' }
    )
    .eq('alias', alias);
};
