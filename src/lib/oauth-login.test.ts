import { afterEach, describe, expect, it, vi } from 'vitest';
import { oauthLoginUrl } from './oauth-login';

describe('oauthLoginUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['google', 'https://api.example.com/admin/auth/oauth/google/authorize'],
    ['github', 'https://api.example.com/admin/auth/oauth/github/authorize'],
  ] as const)('%s 시작 주소는 관리자 API 아래 authorize 경로다', (provider, expected) => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/admin');

    expect(oauthLoginUrl(provider)).toBe(expected);
  });

  it('API 주소 끝의 슬래시는 정리한다', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/admin/');

    expect(oauthLoginUrl('google')).toBe('https://api.example.com/admin/auth/oauth/google/authorize');
  });

  it('API 주소가 설정되지 않았으면 null을 돌려준다', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');

    expect(oauthLoginUrl('google')).toBeNull();
  });
});
