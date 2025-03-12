import 'server-only';

import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';

const TABLE_NAME = 'a_members';
const PAGE_SIZE = 10;

export interface MemberT {
  id: string;
  account: string;
  profile_contract: string;
  username: string;
  name: string;
  description: string;
  image: string;
  image_medium: string;
  image_small: string;
  token_id: string | null;
  created_at: Date;
  updated_at: Date;
}
