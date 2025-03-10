import 'server-only';

import {
  SupabaseClient,
  PostgrestMaybeSingleResponse
} from '@supabase/supabase-js';
const TABLE_NAME = 'admin';

export interface AdminT {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  community_access_list: string[];
  created_at: Date;
  last_active_at: Date;
}

export const getAdminByEmail = async (args: {
  client: SupabaseClient;
  email: string;
}): Promise<PostgrestMaybeSingleResponse<AdminT>> => {
  const { client, email } = args;

  return client.from(TABLE_NAME).select('*').eq('email', email).maybeSingle();
};
