import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // NextAuth의 JWT 토큰 획득
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  console.info('token : ', token);

  // 인증이 필요한 경로 설정 (예시: /dashboard, /admin 등)
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isWellKnown = request.nextUrl.pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/);

  if (!isAuthPage && !token) {
    const currentPath = request.nextUrl.pathname;

    // 로그인 페이지의 리다이렉트 cookie 설정
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);

    if (!isWellKnown) {
      response.cookies.set('callbackUrl', encodeURIComponent(currentPath), {
        path: '/',
      });
    }
    return response;
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
