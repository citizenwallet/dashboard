import 'server-only';

import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';

const TABLE_NAME = 'paymaster_whitelisted_contracts';
const PAGE_SIZE = 25;

export interface Paymaster {
  contract: string;
  paymaster: string;
  alias: string;
  name: string;
  published?: string;
  required: boolean;
}

export const getPaymasterByAlias = async (args: {
  client: SupabaseClient;
  alias: string;
  page: number;
}): Promise<PostgrestResponse<Paymaster>> => {
  const { client, alias, page } = args;
  const offset = (page - 1) * PAGE_SIZE;
  return client
    .from(TABLE_NAME)
    .select('*')
    .eq('alias', alias)
    .range(offset, offset + PAGE_SIZE - 1)
    .limit(PAGE_SIZE);
};

export const updatePaymasterName = async (args: {
  client: SupabaseClient;
  contract: string;
  name: string;
  alias: string;
}) => {
  const { client, contract, name, alias } = args;
  return client
    .from(TABLE_NAME)
    .update({ name })
    .eq('contract', contract)
    .eq('alias', alias);
};

export const getPaymasterByAddress = async (args: {
  client: SupabaseClient;
  address: string;
  alias: string;
}) => {
  const { client, address, alias } = args;
  return client
    .from(TABLE_NAME)
    .select('*')
    .eq('contract', address)
    .eq('alias', alias);
};

export const upsertPaymasterWhitelist = async (args: {
  client: SupabaseClient;
  data: Paymaster[];
}) => {
  const { client, data } = args;
  return client
    .from(TABLE_NAME)
    .upsert(data, { onConflict: 'contract,paymaster' });
};
