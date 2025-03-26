import { NextAuthConfig, CredentialsSignin } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { getServiceRoleClient } from '@/services/top-db';
import { getOTPOfSource, deleteOTPOfSource } from '@/services/top-db/otp';
import { getUserByEmail } from '@/services/top-db/users';

const authConfig = {
  providers: [
    CredentialProvider({
      name: 'OTP Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Verification Code', type: 'text' }
      },
      authorize: async (credentials, request) => {
        let user = null;

        const email = credentials?.email as string;
        const code = credentials?.code as string;

        if (!email || !code) {
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

        user = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        };

        return user;
      }
    })
  ],
  pages: {
    signIn: '/login'
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: `${token.id}`
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
