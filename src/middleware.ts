import { NextResponse } from 'next/server';
import { type AdminLoginResponse } from '@/docs/api';
import { getData } from './lib/api';
import { getAccessToken } from './lib/auth';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // NextAuth의 JWT 토큰 획득
  const token = await getAccessToken();

  // 인증이 필요한 경로 설정
  const isLogin = request.nextUrl.pathname.startsWith('/login');
  const isWellKnown = request.nextUrl.pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/);
  const currentPath = request.nextUrl.pathname;

  if (!token && !isLogin && !isWellKnown) {
    return NextResponse.redirect(new URL('/login?callbackUrl=' + currentPath, request.url));
  }

  // NOTE : 토큰이 존재하면 인증 재시도
  if (token) {
    const isAuthToken = await getData<AdminLoginResponse>(`/user/auth/check`);
    if (!isAuthToken.status) {
      return NextResponse.redirect(new URL('/login?callbackUrl=' + currentPath, request.url));
    }
  }

  // 인증되어 있으면 계속 진행
  const response = NextResponse.next();
  return response;
}

// 적용할 경로 설정 (/api 제외)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
