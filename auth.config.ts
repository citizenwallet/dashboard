import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { getServiceRoleClient } from '@/services/db';
import { getOTPOfSource, deleteOTPOfSource } from '@/services/db/otp';
import { getAdminByEmail } from '@/services/db/admin';

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
        const { data, error } = await getOTPOfSource({ client, source: email });

        if (error) {
          throw new Error(`Failed to get login code for email ${email}`);
        }

        if (!data) {
          throw new Error(`No login code found for email ${email}`);
        }

        if (data.expires_at < new Date()) {
          throw new Error(`Login code expired for email ${email}`);
        }

        if (data.code !== code) {
          throw new Error(`Invalid login code for email ${email}`);
        }

        const { data: adminData, error: adminError } = await getAdminByEmail({
          client,
          email
        });

        if (adminError) {
          throw new Error(`Failed to get admin by email ${email}`);
        }

        if (!adminData) {
          throw new Error(`Admin not found for email ${email}`);
        }

        deleteOTPOfSource({ client, source: email });

        user = {
          id: adminData.id.toString(),
          email: adminData.email,
          name: adminData.name
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
