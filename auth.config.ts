import { getServiceRoleClient } from '@/services/top-db';
import { getUserByEmail } from '@/services/top-db/users';
import { CredentialsSignin, NextAuthConfig, Profile } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { getCommunity } from './services/cw';
import { JWT } from 'next-auth/jwt';
import { createJWT, verifyJWT } from './lib/jwt';

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
  session: {
    strategy: 'jwt'
  },
  jwt: {
    encode: async ({ token, secret }) => {
      if (!token?.verified) {
        const jwtToken = await createJWT(
          {
            email: token?.email as string,
            address: token?.address as string,
            chainId: token?.chainId as number
          },
          secret as string
        );
        return jwtToken;
      } else {
        return token.jwt as unknown as string;
      }
    },
    decode: async ({ token, secret }) => {
      const decodedToken = await verifyJWT(token as string, secret as string);
      return decodedToken as unknown as JWT;
    }
  },
  callbacks: {
    jwt: async ({ token, user, profile }) => {
      profile = user as Profile;

      if (profile) {
        token.email = profile.email;
        token.address = profile?.address;
        token.chainId = profile?.chainId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          email: token.email,
          address: token.address,
          chainId: token.chainId
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
