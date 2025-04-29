'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { createWebhook, CreateWebhook } from '@/services/chain-db/webhooks';
import { Config } from '@citizenwallet/sdk';

export const createWebhookAction = async (args: {
  config: Config;
  webhook: CreateWebhook;
}) => {
  const { config, webhook } = args;

  const { chain_id: chainId } = config.community.profile;

  const supabase = getServiceRoleClient(chainId);

  return await createWebhook({ client: supabase, webhook });
};
