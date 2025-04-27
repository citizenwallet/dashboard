'use server';
import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { saveOTP } from '@/services/top-db/otp';
import { generateOTP } from '@/lib/utils';
import { sendOtpEmail } from '@/services/brevo';
import { signIn } from '@/auth';
import { CredentialsSignin } from 'next-auth';
import { Wallet } from 'ethers';

export async function getUserByEmailAction(args: { email: string }) {
  const { email } = args;

  const client = getServiceRoleClient();
  const { data, error } = await getUserByEmail({ client, email });

  if (error) {
    console.error(error);
    throw new Error('Could not find user by email');
  }

  return data;
}

export async function sendOTPAction(args: { email: string }) {
  const { email } = args;
  const client = getServiceRoleClient();
  const otp = generateOTP();

  // brevo
  sendOtpEmail({ email, otp });

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

export async function signInWithOTP(args: { email: string; code: string }) {
  const { email, code } = args;
  const wallet = Wallet.createRandom();
  try {
    await signIn('credentials', {
      email,
      code,
      privateKey: wallet.privateKey,
      publicKey: wallet.address,
      redirect: false
    });

    return { success: true };
  } catch (error) {
    console.error('error', JSON.stringify(error, null, 2));
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
