import 'server-only';

import { SupabaseClient } from '@supabase/supabase-js';

const TABLE_NAME = 'a_transfers';
const PAGE_SIZE = 10;


export const getTransfersOfToken = async (args: {
  client: SupabaseClient;
    token: string;
    query: string;
    page: number;
  
}) => {
    const { client, token, query, page } = args;

    const offset = (page - 1) * PAGE_SIZE;

    return client
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .eq('token_contract', token)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1); 

 
};
