import { getServiceRoleClient } from '@/services/top-db';
import { deleteOTPOfSource, getOTPOfSource } from '@/services/top-db/otp';
import { getUserByEmail } from '@/services/top-db/users';
import { CredentialsSignin, NextAuthConfig, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialProvider from 'next-auth/providers/credentials';
import { createJWTtoken } from './lib/auth/create-jwt';
import { verifycheckJWT } from './lib/auth/verify-jwt';

const authConfig = {
  providers: [
    CredentialProvider({
      name: 'OTP Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Verification Code', type: 'text' },
        privateKey: { label: 'Private Key', type: 'text' },
        publicKey: { label: 'Public Key', type: 'text' },
        accountAddress: { label: 'Account Address', type: 'text' }
      },
      authorize: async (credentials, request) => {
        let user = null;

        const email = credentials?.email as string;
        const code = credentials?.code as string;
        const privateKey = credentials?.privateKey as string;
        const publicKey = credentials?.publicKey as string;
        const accountAddress = credentials?.accountAddress as string;

        if (!email || !code || !privateKey || !publicKey || !accountAddress) {
          return null;
        }

        const client = getServiceRoleClient();
        const { data, error } = await getOTPOfSource({ client, source: email });

        if (error) {
          throw new CredentialsSignin(
            `Failed to get login code for email ${email}`
          );
        }

        if (!data) {
          throw new CredentialsSignin(`No login code found for email ${email}`);
        }

        if (data.expires_at < new Date()) {
          throw new CredentialsSignin(`Login code expired for email ${email}`);
        }

        if (data.code !== code) {
          throw new CredentialsSignin(`Invalid login code for email ${email}`);
        }

        const { data: userData, error: userError } = await getUserByEmail({
          client,
          email
        });

        if (userError) {
          throw new CredentialsSignin(`Failed to get user by email ${email}`);
        }

        if (!userData) {
          throw new CredentialsSignin(`User not found for email ${email}`);
        }

        deleteOTPOfSource({ client, source: email });

        const profile = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          account: accountAddress,
          privateKey: privateKey,
          publicKey: publicKey
        };

        return profile;
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  jwt: {
    encode: async ({ token }) => {
      if (!token?.verified) {
        const jwtToken = await createJWTtoken(
          {
            id: token?.id as string,
            email: token?.email as string,
            name: token?.name as string
          },
          token?.account as string,
          token?.privateKey as string,
          token?.publicKey as string
        );

        return jwtToken;
      } else {
        return token.jwt as unknown as string;
      }
    },
    decode: async ({ token }) => {
      const decodedToken = await verifycheckJWT(token as string);

      return decodedToken as unknown as JWT;
    }
  },

  callbacks: {
    jwt: async ({ token, user, profile }) => {
      profile = user as Profile;
      if (profile) {
        token.id = profile.id;
        token.email = profile.email;
        token.name = profile.name;
        token.account = profile.account;
        token.privateKey = profile.privateKey;
        token.publicKey = profile.publicKey;
      }

      return token;
    },
    session: async ({ session, token }) => {
      const user = (token as any)?.payload?.user;
      return {
        ...session,
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          account: user?.account
        }
      };
    },
    redirect({ url, baseUrl }) {
      // Allow redirects to the home page
      if (url.startsWith('/')) return url;
      // Allow redirects to the same origin
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
