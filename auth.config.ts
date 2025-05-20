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
        const chainIds = credentials?.chainIds as string;

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

        let parsedChainIds: number[];

        //convert the chainIds string to an array of numbers
        try {
          const parsed = JSON.parse(chainIds);
          parsedChainIds = Array.isArray(parsed)
            ? parsed
            : typeof parsed === 'number'
              ? [parsed]
              : [];
        } catch (e) {
          parsedChainIds = chainIds
            ? chainIds
                .split(',')
                .map((num: string) => parseInt(num.trim(), 10))
                .filter((num: number) => !isNaN(num))
            : [];
        }

        //add the chainId to the OldChainIds array
        parsedChainIds.push(chainId);

        const profile = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          address: address,
          chainId: parsedChainIds
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
    jwt: async ({
      token,
      user,
      trigger,
      session
    }: {
      token: JWT;
      user: User;
      trigger?: 'signIn' | 'signUp' | 'update';
      session?: any;
    }) => {
      if (user) {
        token.email = user.email;
        token.address = user.address;
        token.chainIds = user.chainId;
      }

      if (trigger === 'update') {
        token.chainIds = session.chainIds;
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
