import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import client from '@/lib/db';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { name, email, image } = user;
      await client.execute(
        `INSERT INTO customers (name, email, image_url, google_id)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET name=?, image_url=?`,
        [name, email, image, email, name, image]
      );
      return true;
    },
    async session({ session }) {
      const result = await client.execute(
        `SELECT id FROM customers WHERE email=?`,
        [session.user.email]
      );
      if (result.rows[0]) {
        session.user.id = result.rows[0].id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };