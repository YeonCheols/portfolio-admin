import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // 여기에 실제 유저 인증 로직을 구현
        // 예시: DB에서 유저 조회 및 비밀번호 검증
        // const user = await getUserFromDB(credentials.email);

        // if (user && user.password === credentials?.password) {
        //   // 비밀번호는 반드시 해시로 비교해야 함(예시에서는 단순 비교)
        //   return { id: user.id, name: user.name, email: user.email };
        // }
        // 인증 실패 시 null 반환
        return null;
      },
    }),
  ],
  // 필요에 따라 session, callbacks 등 추가 설정
};

export default NextAuth(authOptions);
