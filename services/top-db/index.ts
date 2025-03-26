import 'server-only';

import { SupabaseClient, createClient } from '@supabase/supabase-js';

export const getServiceRoleClient = (): SupabaseClient => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

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
