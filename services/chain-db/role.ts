import 'server-only';

import { SupabaseClient, PostgrestSingleResponse } from '@supabase/supabase-js';

const TABLE_NAME = 'a_roles';

export interface RoleT {
  id: string;
  account_address: string;
  contract_address: string;
  role: string;
  created_at: Date;
}

export const insertRole = async (args: {
  client: SupabaseClient;
  role: Partial<RoleT>;
}): Promise<PostgrestSingleResponse<RoleT>> => {
  const { client, role } = args;
  return await client.from(TABLE_NAME).insert(role).select().single();
};

export const deleteRole = async (args: {
  client: SupabaseClient;
  role: Partial<RoleT>;
}) => {
  const { client, role } = args;
  return await client
    .from(TABLE_NAME)
    .delete()
    .eq('account_address', role.account_address)
    .eq('contract_address', role.contract_address)
    .eq('role', role.role);
};
