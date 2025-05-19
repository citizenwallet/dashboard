import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { CredentialsSignin, NextAuthConfig, Profile } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { getCommunity } from './services/cw';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    chainIds?: string[];
    email?: string;
    address?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      chainIds?: string[];
      email?: string;
      address?: string;
    };
  }
}

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
        // const chainId = 137;

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
  session: {
    strategy: 'jwt'
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      const profile = user as Profile;
      console.log('old token--->', token);

      if (profile) {
        if (profile?.chainId) {
          // Initialize chainIds array if needed
          if (!Array.isArray(token.chainIds)) {
            token.chainIds = [];
          }

          const newChainId = String(profile.chainId);
          console.log('newChainId--->', newChainId);
          const exists = token.chainIds.includes(newChainId);

          if (!exists) {
            token.chainIds.push(newChainId);
          }
        }
        token.email = profile.email as string;
        token.address = profile.address as string;
      }

      console.log('all finished new token out-->', token);
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          email: token.email,
          address: token.address,
          chainIds: token.chainIds || []
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
