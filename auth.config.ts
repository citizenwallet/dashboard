import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { getServiceRoleClient } from '@/services/db';

const authConfig = {
  providers: [
    CredentialProvider({
      name: 'OTP Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Verification Code', type: 'text' },
        chainId: { label: 'Chain ID', type: 'number' }
      },
      authorize: async (credentials, request) => {
        let user = null;

        const email = credentials?.email as string;
        const code = credentials?.code as string;
        const chainId = credentials?.chainId as number;

        if (!email || !code || !chainId) {
          return null;
        }

        const client = getServiceRoleClient(chainId);

        user = {
          id: '',
          email: '',
          name: ''
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
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
