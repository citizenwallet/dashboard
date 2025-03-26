'use server';

import { getServiceRoleClient as getChainDbClient } from '@/services/chain-db';
import { getServiceRoleClient as getTopDbClient } from '@/services/top-db';
import { z } from 'zod';
import { inviteAdminFormSchema } from './form-schema';
import { addAdminToCommunity as addAdminToCommunityChainDb } from '@/services/chain-db/admin';
import { addUserToCommunity as addUserToCommunityTopDb } from '@/services/top-db/users';
import { sendCommunityInvitationEmail } from '@/services/brevo';
import { generateOTP } from '@/lib/utils';
import { saveOTP } from '@/services/top-db/otp';
import { getAuthUserRoleInCommunityAction } from '@/app/[alias]/(dashboard)/_actions/admin-actions';
import { Config } from '@citizenwallet/sdk';
import { revalidatePath } from 'next/cache';

export async function submitAdminInvitation(args: {
  formData: z.infer<typeof inviteAdminFormSchema>;
  chainId: number;
}) {
  const { formData, chainId } = args;

  const result = inviteAdminFormSchema.safeParse(formData);

  if (!result.success) {
    console.error(result.error);
    throw new Error('Invalid form data');
  }

  const userRole = await getAuthUserRoleInCommunityAction({
    chainId: args.chainId,
    alias: formData.alias
  });

  if (userRole !== 'owner') {
    throw new Error('You are not authorized to add admins to this community');
  }

  const { email, name, avatar, alias, role } = result.data;

  const chainDbClient = getChainDbClient(chainId);
  const topDbClient = getTopDbClient();

  try {
    const [chainDbResult, topDbResult] = await Promise.allSettled([
      addAdminToCommunityChainDb({
        client: chainDbClient,
        data: {
          email,
          name,
          avatar: avatar ?? null,
          alias,
          role,
          chain_id: chainId
        }
      }),
      addUserToCommunityTopDb({
        client: topDbClient,
        data: {
          email,
          name,
          avatar: avatar ?? '',
          chain_id: chainId,
          alias,
          role
        }
      })
    ]);

    // Check results
    if (chainDbResult.status === 'rejected') {
      throw chainDbResult.reason;
    }

    if (topDbResult.status === 'rejected') {
      throw topDbResult.reason;
    }
  } catch (error) {
    console.error(error);
    // Preserve the original error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to add admin to community');
  }

  revalidatePath(`/${alias}/admins`);
}

export async function sendAdminSignInInvitationAction(args: {
  email: string;
  config: Config;
}) {
  const { email, config } = args;

  const { alias: communityAlias, name: communityName } = config.community;
  const { chain_id: chainId } = config.community.profile;

  const userRole = await getAuthUserRoleInCommunityAction({
    chainId,
    alias: communityAlias
  });

  if (userRole !== 'owner') {
    throw new Error('You are not authorized to add admins to this community');
  }

  const topDbClient = getTopDbClient();
  const otp = generateOTP();

  // brevo
  try {
    sendCommunityInvitationEmail({
      email,
      otp,
      communityAlias,
      communityName
    });
  } catch (error) {
    console.error(error);
    // Preserve the original error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to send invitation email');
  }

  // db
  const { error: saveOTPError } = await saveOTP({
    client: topDbClient,
    data: {
      source: email,
      code: otp,
      source_type: 'email'
    }
  });

  if (saveOTPError) {
    console.error(saveOTPError);
    throw new Error('Failed to save OTP');
  }
}
