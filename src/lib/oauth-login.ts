export type OAuthProvider = 'google' | 'github';

/**
 * 선택한 공급자의 인증 시작 주소다. 시작과 토큰 발급은 portfolio-api가 맡고 이 앱은 이동만 시킨다.
 * appOrigin(현재 관리자 앱의 origin)을 넘기면 API가 로그인이 끝난 뒤 이 앱으로 돌려보낸다.
 * 허용 여부는 API가 판단하므로 여기서는 값을 그대로 전달한다.
 */
export function oauthLoginUrl(provider: OAuthProvider, appOrigin?: string): string | null {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
  if (!base) return null;
  const url = `${base}/auth/oauth/${provider}/authorize`;
  return appOrigin ? `${url}?app=${encodeURIComponent(appOrigin)}` : url;
}
