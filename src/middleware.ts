import { NextResponse } from 'next/server';
import { getAccessToken } from './lib/auth';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // NextAuth의 JWT 토큰 획득
  const token = await getAccessToken();

  // 인증이 필요한 경로 설정
  const isLogin = request.nextUrl.pathname.startsWith('/login');
  const isWellKnown = request.nextUrl.pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/);

  if (!token && !isLogin && !isWellKnown) {
    const currentPath = request.nextUrl.pathname;
    // 로그인 후 이동할 경로 설정
    return NextResponse.redirect(new URL('/login?callbackUrl=' + currentPath, request.url));
  }

  // 인증되어 있으면 계속 진행
  const response = NextResponse.next();
  response.cookies.delete('callbackUrl');
  return response;
}

// 적용할 경로 설정 (/api 제외)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
