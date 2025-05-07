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

export const upsertAccountToRole = async (args: {
  client: SupabaseClient;
  role: Pick<RoleT, 'account_address' | 'contract_address' | 'role'>;
}): Promise<PostgrestSingleResponse<RoleT>> => {
  const { client, role } = args;

  return await client
    .from(TABLE_NAME)
    .upsert(role, {
      onConflict: 'account_address,contract_address,role'
    })
    .select()
    .single();
};

export const deleteAccountFromRole = async (args: {
  client: SupabaseClient;
  role: Pick<RoleT, 'account_address' | 'contract_address' | 'role'>;
}) => {
  const { client, role } = args;
  return await client
    .from(TABLE_NAME)
    .delete()
    .eq('account_address', role.account_address)
    .eq('contract_address', role.contract_address)
    .eq('role', role.role);
};
