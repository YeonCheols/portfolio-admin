// @vitest-environment node
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { middleware } from './middleware';

const getAccessToken = vi.fn();
const getData = vi.fn();

vi.mock('./lib/auth', () => ({ getAccessToken: () => getAccessToken() }));
vi.mock('./lib/api', () => ({ getData: (...args: unknown[]) => getData(...args) }));

const request = (path: string) => new NextRequest(new URL(path, 'https://admin.example.test'));

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('토큰이 없으면 로그인 화면으로 보내고 callbackUrl을 인코딩한다', async () => {
    getAccessToken.mockResolvedValue(undefined);

    const response = await middleware(request('/stacks/a&b=1?x=2&y=3'));

    const location = new URL(response.headers.get('location') ?? '');
    expect(location.pathname).toBe('/login');
    expect([...location.searchParams.keys()]).toEqual(['callbackUrl']);
    expect(location.searchParams.get('callbackUrl')).toBe('/stacks/a&b=1?x=2&y=3');
  });

  it('토큰 확인에 실패하면 로그인 화면으로 보낸다', async () => {
    getAccessToken.mockResolvedValue('token');
    getData.mockResolvedValue({ status: false });

    const response = await middleware(request('/stacks'));

    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/login');
  });

  it('토큰이 유효하면 그대로 진행한다', async () => {
    getAccessToken.mockResolvedValue('token');
    getData.mockResolvedValue({ status: true });

    const response = await middleware(request('/stacks'));

    expect(response.headers.get('location')).toBeNull();
  });
});
