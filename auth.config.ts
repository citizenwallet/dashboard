import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { CredentialsSignin, NextAuthConfig, Profile } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { getCommunity } from './services/cw';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    chainIds?: number[];
    email?: string;
    address?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      chainIds?: number[];
      email?: string;
      address?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    address: string;
    chainId: number[];
  }
}

const authConfig = {
  providers: [
    CredentialProvider({
      name: 'OTP Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        alias: { label: 'Alias', type: 'text' },
        address: { label: 'Address', type: 'text' },
        chainIds: { label: 'Chain IDs', type: 'string' }
      },
      authorize: async (credentials, request) => {
        let user = null;

        const email = credentials?.email as string;
        const alias = credentials?.alias as string;
        const address = credentials?.address as string;
        const chainIds = credentials?.chainIds as string | number[] | undefined;

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

        let parsedChainIds: number[] = [];

        //if chainIds is a string, parse it
        if (typeof chainIds === 'string') {
          try {
            parsedChainIds = JSON.parse(chainIds.trim());
          } catch {
            parsedChainIds = chainIds
              .replace(/[\[\]\s]/g, '')
              .split(',')
              .map((n: string) => Number(n))
              .filter((n: number) => !isNaN(n));
          }
        }

        let newChainIds: number[] = [];

        //if parsedChainIds is an array, add the chainId to it
        if (parsedChainIds.length > 0) {
          newChainIds = [...parsedChainIds, chainId];
        } else {
          newChainIds = [chainId];
        }

        const profile = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          address: address,
          chainId: newChainIds
        };

        return profile;
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 365 //session expires in 365 days
  },

  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user: User }) => {
      if (user) {
        token.email = user.email;
        token.address = user.address;
        token.chainIds = user.chainId;
      }

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
