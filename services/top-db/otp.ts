import 'server-only';

import {
  SupabaseClient,
  PostgrestMaybeSingleResponse
} from '@supabase/supabase-js';

const TABLE_NAME = 'otp';

export interface OtpT {
  source: string;
  source_type: string;
  code: string;
  expires_at: Date;
  created_at: Date;
}

export const saveOTP = async (args: {
  client: SupabaseClient;
  data: Pick<OtpT, 'source' | 'source_type' | 'code'>;
}) => {
  const { client, data } = args;
  const { source, source_type, code } = data;

  return client.from(TABLE_NAME).upsert(
    {
      source: source,
      source_type: source_type,
      code: code,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    },
    {
      onConflict: 'source'
    }
  );
};

export const getOTPOfSource = async (args: {
  client: SupabaseClient;
  source: string;
}): Promise<PostgrestMaybeSingleResponse<OtpT>> => {
  const { client, source } = args;

  return client
    .from(TABLE_NAME)
    .select('*')
    .eq('source', source)
    .order('created_at', { ascending: false })
    .maybeSingle();
};

export const deleteOTPOfSource = async (args: {
  client: SupabaseClient;
  source: string;
}) => {
  const { client, source } = args;
  return client.from(TABLE_NAME).delete().eq('source', source);
};
