'use server';
import { getServiceRoleClient } from '@/services/db';
import { getAdminByEmail } from '@/services/db/admin';
import { saveOTP } from '@/services/db/otp';
import { generateOTP } from '@/lib/utils';
import { sendOtpEmail } from '@/services/brevo';

export async function getAdminByEmailAction(args: {
  email: string;
  chainId: number;
}) {
  const { email, chainId } = args;

  const client = getServiceRoleClient(chainId);
  const { data, error } = await getAdminByEmail({ client, email });

  if (error) {
    console.error(error);
    throw new Error('Could not find admin by email');
  }

  return data;
}

export async function sendOTPAction(args: { email: string; chainId: number }) {
  const { email, chainId } = args;
  const client = getServiceRoleClient(chainId);
  const otp = generateOTP();

  // brevo
  await sendOtpEmail({ email, otp });

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
