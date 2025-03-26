import 'server-only';

import { SupabaseClient, createClient } from '@supabase/supabase-js';

export const getServiceRoleClient = (chainId: number): SupabaseClient => {
  const serviceRoleKey = getServiceRoleKey(chainId);
  const url = getUrl(chainId);
  const anonKey = getAnonKey(chainId);

  if (!serviceRoleKey || !url || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  });
};

const getServiceRoleKey = (chainId: number): string => {
  return process.env[`SUPABASE_${chainId}_SERVICE_ROLE_KEY`] ?? '';
};

const getUrl = (chainId: number): string => {
  return process.env[`SUPABASE_${chainId}_URL`] ?? '';
};

const getAnonKey = (chainId: number): string => {
  return process.env[`SUPABASE_${chainId}_ANON_KEY`] ?? '';
};
