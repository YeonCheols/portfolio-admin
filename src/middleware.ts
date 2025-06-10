import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // NextAuth의 JWT 토큰 획득
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // 인증이 필요한 경로 설정 (예시: /dashboard, /admin 등)
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  if (!isAuthPage && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 인증되어 있으면 계속 진행
  return NextResponse.next();
}

// 적용할 경로 설정 (/api 제외)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
