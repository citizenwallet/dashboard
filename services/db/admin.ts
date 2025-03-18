import 'server-only';

import {
  SupabaseClient,
  PostgrestMaybeSingleResponse,
  PostgrestResponse
} from '@supabase/supabase-js';

const TABLE_NAME = 'admin';

export type AdminRoleT = 'owner' | 'member';
export interface AdminT {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  created_at: Date;
  last_active_at: Date;
}
export interface AdminCommunityAccessT {
  id: number;
  role: AdminRoleT;
  alias: string;
  admin_id: number;
  chain_id: number;
  created_at: Date;
  updated_at: Date;
}

export const getAdminByEmail = async (args: {
  client: SupabaseClient;
  email: string;
}): Promise<
  PostgrestMaybeSingleResponse<
    AdminT & { admin_community_access: AdminCommunityAccessT[] }
  >
> => {
  const { client, email } = args;

  return client
    .from(TABLE_NAME)
    .select(
      `
      *,
      admin_community_access!admin_id(*)
    `
    )
    .eq('email', email)
    .maybeSingle();
};

// TODO: take from admin_community_access table
export const getAdminsOfCommunity = async (args: {
  alias: string;
  client: SupabaseClient;
}): Promise<PostgrestResponse<AdminT>> => {
  const { alias, client } = args;

  return client
    .from(TABLE_NAME)
    .select('*', { count: 'exact' })
    .contains('community_access_list', [alias]);
};
