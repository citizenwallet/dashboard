import 'server-only';

import { SupabaseClient } from '@supabase/supabase-js';

export const uploadImage = async (
  client: SupabaseClient,
  image: File,
  alias: string
): Promise<string> => {
  let url = '';
  const fileName = `${Date.now()}-${image.name}`;
  const { data, error } = await client.storage
    .from(`uploads/${alias}`)
    .upload(fileName, image);

  if (error) {
    throw error;
  }
  url = await client.storage.from(`uploads/${alias}`).getPublicUrl(fileName)
    .data.publicUrl;

  return url;
};
