import 'server-only';

import {
  SupabaseClient,
  PostgrestMaybeSingleResponse,
  PostgrestResponse
} from '@supabase/supabase-js';

const ADMIN_TABLE_NAME = 'admin';
const ADMIN_COMMUNITY_ACCESS_TABLE_NAME = 'admin_community_access';

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
    .from(ADMIN_TABLE_NAME)
    .select(
      `
      *,
      admin_community_access!admin_id(*)
    `
    )
    .eq('email', email)
    .maybeSingle();
};

export const getAdminsOfCommunity = async (args: {
  alias: string;
  client: SupabaseClient;
}): Promise<PostgrestResponse<AdminCommunityAccessT & { admin: AdminT }>> => {
  const { alias, client } = args;

  return client
    .from(ADMIN_COMMUNITY_ACCESS_TABLE_NAME)
    .select(`
      *,
      admin!admin_id(*)
    `, { count: 'exact' })
    .eq('alias', alias);
};
