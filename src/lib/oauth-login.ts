export type OAuthProvider = 'google' | 'github';

/** 선택한 공급자의 인증 시작 주소다. 시작과 토큰 발급은 portfolio-api가 맡고 이 앱은 이동만 시킨다. */
export function oauthLoginUrl(provider: OAuthProvider): string | null {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
  if (!base) return null;
  return `${base}/auth/oauth/${provider}/authorize`;
}
