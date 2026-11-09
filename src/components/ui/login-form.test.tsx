import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('공급자별 시작 주소로 이동하는 링크에 현재 관리자 앱 주소를 붙여 보여준다', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/admin');
    render(<LoginForm />);

    const app = encodeURIComponent(window.location.origin);
    expect(screen.getByRole('link', { name: 'Google로 로그인' })).toHaveAttribute(
      'href',
      `https://api.example.com/admin/auth/oauth/google/authorize?app=${app}`,
    );
    expect(screen.getByRole('link', { name: 'GitHub로 로그인' })).toHaveAttribute(
      'href',
      `https://api.example.com/admin/auth/oauth/github/authorize?app=${app}`,
    );
  });

  it('API 주소가 없으면 깨진 링크 대신 설정 안내를 보여준다', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    render(<LoginForm />);

    expect(screen.queryByRole('link', { name: /로그인/ })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('로그인 주소가 설정되지 않았습니다');
  });

  it('공급자를 누르면 이동 중으로 표시하고 같은 화면에서 다른 공급자를 막는다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/admin');
    render(<LoginForm />);
    const github = screen.getByRole('link', { name: 'GitHub로 로그인' });
    // 실제 이동은 jsdom이 지원하지 않으므로 클릭 동작만 확인한다
    github.addEventListener('click', event => event.preventDefault());

    await userEvent.setup().click(github);

    expect(screen.getByRole('link', { name: /GitHub로 이동하는 중/ })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('link', { name: 'Google로 로그인' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('서버가 알려준 거절 코드를 안내 문구로 보여준다', () => {
    render(<LoginForm error="ACCESS_DENIED" />);

    expect(screen.getByRole('alert')).toHaveTextContent('등록된 관리자 계정이 아닙니다');
  });

  it('오류 코드가 없으면 안내를 보여주지 않는다', () => {
    render(<LoginForm />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('이메일·비밀번호 입력 방식은 보여주지 않는다', () => {
    render(<LoginForm />);

    expect(screen.queryByLabelText('이메일')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('비밀번호')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '로그인' })).not.toBeInTheDocument();
  });
});
