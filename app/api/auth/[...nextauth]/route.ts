import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { connectDB } from '@/lib/db';
import User from '@/models/User';


const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text', placeholder: '0912...' },
        otp: { label: 'OTP', type: 'text', placeholder: '123456' },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ phone: credentials?.phone });
        if (!user) return null;
        // TODO: Implement OTP verification logic here
        // For now, accept any OTP for demo
        return user;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
