'use server';

import { getServiceRoleClient } from '@/services/db';
import { z } from 'zod';
import { inviteAdminFormSchema } from './form-schema';
import { addAdminToCommunity } from '@/services/db/admin';
import { sendOtpEmail } from '@/services/brevo';
import { generateOTP } from '@/lib/utils';
import { saveOTP } from '@/services/db/otp';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/admin-actions';

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
    const admin = await addAdminToCommunity({
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
  chainId: number;
}) {
  const { email, chainId } = args;
  const client = getServiceRoleClient(chainId);
  const otp = generateOTP();

  // brevo
  // TODO: need to replace with new template
  sendOtpEmail({ email, otp });

  // db
  const { error: saveOTPError } = await saveOTP({
    client,
    source: email,
    code: otp,
    source_type: 'email'
  });

  if (saveOTPError) {
    console.error(saveOTPError);
    throw new Error('Failed to save OTP');
  }
}
