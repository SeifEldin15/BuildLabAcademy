import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from 'pg'
import type { Account, User } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'buildlab_user',
  password: 'buildlab_password',
  database: 'buildlab_db',
})

export const authOptions: NextAuthOptions = {
  adapter: PostgresAdapter(pool),
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
          // Check if user already exists in your custom users table
          const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [user.email]
          );

          if (existingUser.rows.length === 0) {
            // Create user in your custom users table
            await pool.query(
              'INSERT INTO users (id, email, name, email_verified, created_at) VALUES ($1, $2, $3, $4, $5)',
              [user.id, user.email, user.name, true, new Date()]
            );
          } else {
            // Update existing user's verification status
            await pool.query(
              'UPDATE users SET email_verified = true WHERE email = $1',
              [user.email]
            );
          }
        } catch (error) {
          console.error('Error handling Google sign-in:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user }: { session: any; user: any }) {
      // Add user ID to session
      if (session?.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database' as const,
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
