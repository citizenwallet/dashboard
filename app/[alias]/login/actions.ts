'use server';
import { signIn } from '@/auth';
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
    await signIn('credentials', {
      email,
      address,
      alias,
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
//This part not run on admin role
export async function submitEmailFormAction({
  formData,
  config
}: {
  formData: z.infer<typeof emailFormSchema>;
  config: Config;
}) {
  // Validate form data
  const formDataParseResult = emailFormSchema.safeParse(formData);
  if (!formDataParseResult.success) {
    console.error(formDataParseResult.error);
    throw new Error('Invalid form data');
  }

  // Initialize configuration
  const communityConfig = new CommunityConfig(config);
  const provider = communityConfig.primarySessionConfig.provider_address;

  // Generate session parameters
  const signer = Wallet.createRandom();
  const sessionOwner = signer.address;

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

  const hashInBytes = getBytes(hash);
  const signature = await signer.signMessage(hashInBytes);

  // Prepare request payload
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
    sessionRequestTxHash: responseBody.sessionRequestTxHash,
    hash,
    privateKey: signer.privateKey
  };
}

//This part not run on admin role
export async function submitOtpFormAction({
  formData,
  config
}: {
  formData: z.infer<typeof otpFormSchema>;
  config: Config;
}) {
  const formDataParseResult = otpFormSchema.safeParse(formData);
  if (!formDataParseResult.success) {
    console.error(formDataParseResult.error);
    throw new Error('Invalid form data');
  }

  const communityConfig = new CommunityConfig(config);
  const provider = communityConfig.primarySessionConfig.provider_address;

  const signer = new Wallet(formData.privateKey);
  const sessionOwner = signer.address;

  const sessionHash = generateSessionHash({
    sessionRequestHash: formData.sessionRequestHash,
    challenge: parseInt(formData.code)
  });

  const sessionHashInBytes = getBytes(sessionHash);
  const signature = await signer.signMessage(sessionHashInBytes);

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
