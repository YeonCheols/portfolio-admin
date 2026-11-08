import { NextResponse } from 'next/server';
import { type AdminLoginResponse } from '@/docs/api';
import { getData } from './lib/api';
import { getAccessToken } from './lib/auth';
import { safeCallbackUrl } from './lib/safe-callback-url';
import type { NextRequest } from 'next/server';

function redirectToLogin(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL('/login', request.url);
  // 경로에 &나 ? 가 있어도 쿼리가 새지 않도록 인코딩해서 붙인다
  loginUrl.searchParams.set('callbackUrl', safeCallbackUrl(`${pathname}${search}`));
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  // NextAuth의 JWT 토큰 획득
  const token = await getAccessToken();

  // 인증이 필요한 경로 설정
  const isLogin = request.nextUrl.pathname.startsWith('/login');
  const isWellKnown = request.nextUrl.pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/);

  if (!token && !isLogin && !isWellKnown) {
    return redirectToLogin(request);
  }

  // NOTE : 토큰이 존재하면 인증 재시도
  if (token) {
    const isAuthToken = await getData<AdminLoginResponse>(`/user/auth/check`);
    if (!isAuthToken.status) {
      return redirectToLogin(request);
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
