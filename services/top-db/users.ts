import 'server-only';

import {
  SupabaseClient,
  PostgrestMaybeSingleResponse
} from '@supabase/supabase-js';

const USERS_TABLE_NAME = 'users';
const USERS_COMMUNITY_ACCESS_TABLE_NAME = 'users_community_access';

export type UserRoleT = 'owner' | 'member';

export interface UserT {
  id: string;
  email: string;
  name: string;
  avatar: string;
  created_at: Date;
  last_active_at: Date;
}

export interface UserCommunityAccessT {
  id: number;
  user_id: number;
  alias: string;
  chain_id: number;
  role: UserRoleT;
  created_at: Date;
  updated_at: Date;
}

export const getUserByEmail = async (args: {
  client: SupabaseClient;
  email: string;
}): Promise<
  PostgrestMaybeSingleResponse<
    UserT & { users_community_access: UserCommunityAccessT[] }
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

export const addUserToCommunity = async (args: {
  client: SupabaseClient;
  data: Pick<UserT, 'email' | 'name' | 'avatar'> &
    Pick<UserCommunityAccessT, 'chain_id' | 'alias' | 'role'>;
}) => {
  const { client, data } = args;
  const { email, name, avatar, chain_id, alias, role } = data;

  const { data: user, error: userError } = await client
    .from(USERS_TABLE_NAME)
    .upsert({ email, name, avatar }, { onConflict: 'email' })
    .select()
    .single();

  if (userError) throw userError;

  const { data: access, error: accessError } = await client
    .from(USERS_COMMUNITY_ACCESS_TABLE_NAME)
    .upsert(
      {
        user_id: user.id,
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

  if (accessError) throw accessError;

  return { user, access };
};

export const removeUserFromCommunity = async (args: {
  client: SupabaseClient;
  data: Pick<UserCommunityAccessT, 'alias'> & Pick<UserT, 'email'>;
}) => {
  const { client, data } = args;
  const { alias, email } = data;

  const { data: user, error: userError } = await client
    .from(USERS_TABLE_NAME)
    .select('id')
    .eq('email', email)
    .single();

  if (userError) throw userError;

  const { id: user_id } = user;

  return client
    .from(USERS_COMMUNITY_ACCESS_TABLE_NAME)
    .delete()
    .eq('user_id', user_id)
    .eq('alias', alias);
};
