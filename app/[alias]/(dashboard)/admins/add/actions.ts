'use server';

import { getServiceRoleClient } from '@/services/chain-db';
import { z } from 'zod';
import { inviteAdminFormSchema } from './form-schema';
import { addAdminToCommunity } from '@/services/chain-db/admin';
import { sendCommunityInvitationEmail } from '@/services/brevo';
import { generateOTP } from '@/lib/utils';
import { saveOTP } from '@/services/top-db/otp';
import { getAuthUserRoleInCommunityAction } from '@/app/[alias]/(dashboard)/_actions/admin-actions';
import { Config } from '@citizenwallet/sdk';

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

  const client = getServiceRoleClient(chainId);

  try {
    await addAdminToCommunity({
      client,
      data: {
        email,
        name,
        avatar: avatar ?? null,
        alias,
        role,
        chain_id: chainId
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not add admin to community');
  }
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

  const client = getServiceRoleClient(chainId);
  const otp = generateOTP();

  // brevo
  try {
    await sendCommunityInvitationEmail({
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
    client,
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
