import { LOGIN_PAGE_URL } from '@/lib/frontend/urls';
import Github from 'next-auth/providers/github';
import NextAuth, { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: LOGIN_PAGE_URL
  },
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID || '',
      clientSecret: process.env.AUTH_GITHUB_SECRET || '',
      httpOptions: {
        timeout: 60000
      }
    })
  ]
};

export default NextAuth(authOptions);
