import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authConfig: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // console.log('JWT callback:', { account, profile, user }); // Add logging

      if (account) {
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.access_token = token?.access_token as string;
      }

      return session;
    },
  },
};
