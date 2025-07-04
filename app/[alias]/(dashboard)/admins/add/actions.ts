'use server';

import { getServiceRoleClient as getTopDbClient } from '@/services/top-db';
import { z } from 'zod';
import { inviteAdminFormSchema } from './form-schema';

import { addUserRowoApp, addUserRowoCommunity } from '@/services/top-db/users';
import { saveOTP } from '@/services/top-db/otp';

import { sendCommunityInvitationEmail } from '@/services/brevo';
import { generateOTP } from '@/lib/utils';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
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
    alias: formData.alias
  });

  if (userRole !== 'owner') {
    throw new Error('You are not authorized to add admins to this community');
  }

  const { email, name, avatar, alias, role } = result.data;

  const topDbClient = getTopDbClient();

  const { data: user, error: addUserRowoAppError } = await addUserRowoApp({
    client: topDbClient,
    data: {
      email,
      name,
      avatar: avatar ?? null
    }
  });

  if (addUserRowoAppError) {
    console.error(addUserRowoAppError);
    throw new Error('Failed to add user to app');
  }

  const { error: addUserRowoCommunityError } = await addUserRowoCommunity({
    client: topDbClient,
    data: {
      user_id: user.id,
      alias,
      role,
      chain_id: chainId
    }
  });

  if (addUserRowoCommunityError) {
    console.error(addUserRowoCommunityError);
    throw new Error('Failed to add user to community');
  }

  revalidatePath(`/${alias}/admins`);
}

export async function sendAdminSignInInvitationAction(args: {
  email: string;
  config: Config;
}) {
  const { email, config } = args;

  const { alias: communityAlias, name: communityName } = config.community;

  const userRole = await getAuthUserRoleInCommunityAction({
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
