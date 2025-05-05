'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import {
  createWebhook,
  CreateWebhook,
  deleteWebhook,
  updateWebhook,
  Webhook
} from '@/services/chain-db/webhooks';
import { Config } from '@citizenwallet/sdk';
import { revalidatePath } from 'next/cache';

export const createWebhookAction = async (args: {
  config: Config;
  webhook: CreateWebhook;
}) => {
  const { config, webhook } = args;

  const { chain_id: chainId } = config.community.profile;

  const supabase = getServiceRoleClient(chainId);

  return await createWebhook({ client: supabase, webhook });
};

export const deleteWebhookAction = async (args: {
  config: Config;
  id: string;
}) => {
  const { config, id } = args;
  const { chain_id: chainId } = config.community.profile;

  const supabase = getServiceRoleClient(chainId);
  revalidatePath(`/${config.community.alias}/webhooks`);
  return await deleteWebhook({ client: supabase, id });
};

export const updateWebhookAction = async (args: {
  config: Config;
  id: string;
  webhook: Partial<Webhook>;
}) => {
  const { config, id, webhook } = args;
  const { chain_id: chainId } = config.community.profile;

  const supabase = getServiceRoleClient(chainId);

  return await updateWebhook({ client: supabase, id, webhook });
};
