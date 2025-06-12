// src/lib/auth.ts
import bcrypt from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// 임시 사용자 데이터 (실제 DB 연결시 삭제)
const tempUsers = [
  {
    id: '1',
    email: 's9292909@gmail.com',
    password: await bcrypt.hash('admin1234', 10),
    name: 'Test User',
  },
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요');
        }

        const user = tempUsers.find(u => u.email === credentials.email);
        if (!user) throw new Error('존재하지 않는 사용자입니다');

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('비밀번호가 일치하지 않습니다');

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 60 * 60 },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return url;
      }
      return baseUrl;
    },
  },
};
