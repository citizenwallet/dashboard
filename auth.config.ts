import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { CredentialsSignin, NextAuthConfig, Profile } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { getCommunity } from './services/cw';

const authConfig = {
  providers: [
    CredentialProvider({
      name: 'OTP Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        alias: { label: 'Alias', type: 'text' },
        address: { label: 'Address', type: 'text' }
      },
      authorize: async (credentials, request) => {
        let user = null;

        const email = credentials?.email as string;
        const alias = credentials?.alias as string;
        const address = credentials?.address as string;

        if (!email || !alias || !address) {
          return null;
        }

        const client = getServiceRoleClient();

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

        const { community } = await getCommunity(alias);
        const chainId = community.community.profile.chain_id;

        const profile = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          address: address,
          chainId: chainId
        };

        return profile;
      }
    })
  ],
  pages: {
    signIn: '/login'
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      const profile = user as Profile;

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.address = profile?.address;
        token.chainId = profile?.chainId;
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
