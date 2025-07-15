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
