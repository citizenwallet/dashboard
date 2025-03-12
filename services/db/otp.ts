import 'server-only';

import {
  SupabaseClient,
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse
} from '@supabase/supabase-js';
const TABLE_NAME = 'otp';

export interface OtpT {
  soruce: string;
  code: string;
  created_at: Date;
  expires_at: Date;
  source_type: string;
}

export const saveOTP = async (args: {
  client: SupabaseClient;
  source: string;
  code: string;
  source_type: string;
}) => {
  const { client, source, code, source_type } = args;

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

  return client.from(TABLE_NAME).select('*').eq('source', source).maybeSingle();
};

export const deleteOTPOfSource = async (args: {
  client: SupabaseClient;
  source: string;
}) => {
  const { client, source } = args;
  return client.from(TABLE_NAME).delete().eq('source', source);
};
