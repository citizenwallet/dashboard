'use server';
import { auth, signIn } from '@/auth';
import { generateOTP } from '@/lib/utils';
import { sendOtpEmail } from '@/services/brevo';
import { getServiceRoleClient } from '@/services/top-db';
import { saveOTP } from '@/services/top-db/otp';
import { getUserByEmail } from '@/services/top-db/users';
import {
  CommunityConfig,
  Config,
  generateSessionHash,
  generateSessionRequestHash,
  generateSessionSalt
} from '@citizenwallet/sdk';
import { Wallet, getBytes } from 'ethers';
import { CredentialsSignin } from 'next-auth';
import { z } from 'zod';
import { emailFormSchema, otpFormSchema } from './form-schema';

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

  try {
    await signIn('credentials', {
      email,
      code,
      address: 0,
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

export async function signInWithOutOTP(args: {
  email: string;
  address: string;
  alias: string;
}) {
  const { email, address, alias } = args;

  try {
    const session = await auth();
    const chainIds = session?.user?.chainIds || [];

    await signIn('credentials', {
      email,
      address,
      alias,
      chainIds,
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

export async function generateEmailFormHashAction({
  formData,
  sessionOwner,
  config
}: {
  formData: z.infer<typeof emailFormSchema>;
  sessionOwner: string;
  config: Config;
}) {
  // Validate form data
  const formDataParseResult = emailFormSchema.safeParse(formData);
  if (!formDataParseResult.success) {
    console.error(formDataParseResult.error);
    throw new Error('Invalid form data');
  }

  const communityConfig = new CommunityConfig(config);

  // Calculate expiry time
  const SECONDS_PER_DAY = 60 * 60 * 24;
  const DAYS = 365;
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + SECONDS_PER_DAY * DAYS;

  // Generate session credentials
  const salt = generateSessionSalt({
    source: formData.email,
    type: formData.type
  });

  const hash = generateSessionRequestHash({
    community: communityConfig,
    sessionOwner,
    salt,
    expiry
  });

  return { hash, expiry };
}

export async function sendEmailFormRequestAction({
  provider,
  sessionOwner,
  formData,
  expiry,
  signature,
  config
}: {
  provider: string;
  sessionOwner: string;
  formData: z.infer<typeof emailFormSchema>;
  expiry: number;
  signature: string;
  config: Config;
}) {
  const requestBody = {
    provider,
    owner: sessionOwner,
    source: formData.email,
    type: formData.type,
    expiry,
    signature
  };

  const alias = config.community.alias;
  const url = `${process.env.NEXT_PUBLIC_CW_SESSION_API_BASE_URL}/app/${alias}/session`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseBody: {
    sessionRequestTxHash: string;
    status: number;
  } = await response.json();

  return {
    sessionRequestTxHash: responseBody.sessionRequestTxHash
  };
}

export async function generateOtpFormHashAction({
  formData
}: {
  formData: z.infer<typeof otpFormSchema>;
}) {
  const formDataParseResult = otpFormSchema.safeParse(formData);
  if (!formDataParseResult.success) {
    console.error(formDataParseResult.error);
    throw new Error('Invalid form data');
  }

  const sessionHash = generateSessionHash({
    sessionRequestHash: formData.sessionRequestHash,
    challenge: parseInt(formData.code)
  });

  return sessionHash;
}

export async function submitOtpFormAction({
  formData,
  config,
  sessionOwner,
  sessionHash,
  signature
}: {
  formData: z.infer<typeof otpFormSchema>;
  config: Config;
  sessionOwner: string;
  sessionHash: string;
  signature: string;
}) {
  const communityConfig = new CommunityConfig(config);
  const provider = communityConfig.primarySessionConfig.provider_address;

  const requestBody = {
    provider: provider,
    owner: sessionOwner,
    sessionRequestHash: formData.sessionRequestHash,
    sessionHash: sessionHash,
    signedSessionHash: signature
  };

  const alias = config.community.alias;
  const url = `${process.env.NEXT_PUBLIC_CW_SESSION_API_BASE_URL}/app/${alias}/session`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseBody: {
    sessionConfirmTxHash: string;
    status: number;
  } = await response.json();

  return {
    sessionRequestTxHash: responseBody.sessionConfirmTxHash
  };
}
