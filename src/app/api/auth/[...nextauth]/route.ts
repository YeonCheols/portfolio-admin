import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// 임시 사용자  (실제 DB 연결 예정)
const users = [
  {
    id: '1',
    email: 's9292909@gmail.com',
    password: await bcrypt.hash('admin1234', 10),
    name: 'Test User',
  },
];

export const handler = NextAuth({
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    Credentials({
      credentials: { email: {}, password: {}, callbackUrl: {} },
      authorize: async (credentials, req): Promise<any> => {
        if (!credentials) return null;

        try {
          const user = users.find(u => u.email === credentials.email);
          if (!user)
            return {
              error: '401',
              message: 'Unauthorized',
            };
          const isValid = await bcrypt.compare(credentials.password.toString(), user.password);
          if (isValid) {
            return user;
          }
          return { error: '401', message: 'Unauthorized' };
        } catch (error) {
          return {
            error: '500',
            message: 'Internal Server Error',
          };
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
