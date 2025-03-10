'use server';
import { getServiceRoleClient } from '@/services/db';
import { getAdminByEmail } from '@/services/db/admin';
import { saveOTP } from '@/services/db/otp';
import { generateOTP } from '@/lib/utils';
import { sendOtpEmail } from '@/services/brevo';
import { signIn } from '@/auth';
import { CredentialsSignin } from 'next-auth';

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
  // TODO: uncomment later
  // await sendOtpEmail({ email, otp });

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

export async function signInWithOTP(args: {
  email: string;
  code: string;
  chainId: number;
}) {
  const { email, code, chainId } = args;

  try {
    await signIn('credentials', {
      email,
      code,
      chainId,
      redirect: false
    });

    return { success: true };
  } catch (error) {
    console.log('error', JSON.stringify(error, null, 2));
    if (error instanceof CredentialsSignin) {
      throw new Error(
        error.message.replace(
          'Read more at https://errors.authjs.dev#credentialssignin',
          ''
        )
      );
    }
    throw new Error('Sign in failed');
  }
}
