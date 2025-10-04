import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import pool from '@/lib/db'
import type { Account, User } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'

export const authOptions: NextAuthOptions = {
  // Remove the PostgresAdapter to avoid database connection issues
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User | AdapterUser; account: Account | null }) {
      if (account?.provider === 'google') {
        try {
          // Use docker exec to interact with database directly to avoid connection issues
          const { exec } = require('child_process');
          const util = require('util');
          const execPromise = util.promisify(exec);

          const checkUserCommand = `docker exec buildlab_postgres psql -U buildlab_user -d buildlab_db -c "SELECT id FROM users WHERE email = '${user.email}';" -t`;
          const { stdout } = await execPromise(checkUserCommand);

          if (!stdout.trim()) {
            // Create user in your custom users table using docker exec
            // For OAuth users, we'll set a placeholder password_hash since it's required
            const insertUserCommand = `docker exec buildlab_postgres psql -U buildlab_user -d buildlab_db -c "INSERT INTO users (email, name, password_hash, email_verified, created_at) VALUES ('${user.email}', '${user.name?.replace(/'/g, "''")}', 'oauth_user_no_password', true, NOW());"`;
            await execPromise(insertUserCommand);
          } else {
            // Update existing user's verification status
            const updateUserCommand = `docker exec buildlab_postgres psql -U buildlab_user -d buildlab_db -c "UPDATE users SET email_verified = true WHERE email = '${user.email}';"`;
            await execPromise(updateUserCommand);
          }
        } catch (error) {
          console.error('Error handling Google sign-in:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add user info to session from token
      if (session?.user && token) {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      // Store user info in JWT token
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Always redirect to home page after successful login
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
