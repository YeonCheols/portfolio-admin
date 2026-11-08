import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from './login-form';

const push = vi.fn();
const refresh = vi.fn();
const postData = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock('@/lib/api', () => ({ postData: (...args: unknown[]) => postData(...args) }));
vi.mock('react-hot-toast', () => ({
  default: { loading: vi.fn(), dismiss: vi.fn(), error: vi.fn() },
}));

const submit = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('이메일'), 'admin@example.com');
  await user.type(screen.getByLabelText('비밀번호'), 'Passw0rd!');
  await user.click(screen.getByRole('button', { name: '로그인' }));
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postData.mockResolvedValue({ status: true });
  });

  it('외부 주소가 담긴 callbackUrl로는 이동하지 않고 /로 이동한다', async () => {
    render(<LoginForm callbackUrl="https://example.test/phish" />);

    await submit();

    await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
    expect(push).toHaveBeenCalledWith('/');
  });
  it('같은 사이트 경로는 그대로 복귀한다', async () => {
    render(<LoginForm callbackUrl="/stacks" />);

    await submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith('/stacks'));
  });

  it.each([
    ['서버 오류(500)', { status: false, error: { status: 500 } }],
    ['네트워크 오류', { status: false, error: { code: 'ERR_NETWORK' } }],
  ])('%s이면 이동하지 않고 오류 안내를 보여준다', async (_name, result) => {
    postData.mockResolvedValue(result);
    render(<LoginForm callbackUrl="/stacks" />);

    await submit();

    expect(await screen.findByRole('alert')).toHaveTextContent('로그인에 실패했습니다');
    expect(push).not.toHaveBeenCalled();
  });

  it('401이면 계정 정보 안내를 보여주고 이동하지 않는다', async () => {
    postData.mockResolvedValue({ status: false, error: { status: 401 } });
    render(<LoginForm callbackUrl="/stacks" />);

    await submit();

    expect(await screen.findByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
  it('비밀번호 입력창에서 Enter를 누르면 제출된다', async () => {
    render(<LoginForm callbackUrl="/stacks" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('이메일'), 'admin@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'Passw0rd!{Enter}');

    await waitFor(() => expect(postData).toHaveBeenCalledTimes(1));
    expect(push).toHaveBeenCalledWith('/stacks');
  });
  describe('Google·GitHub 로그인', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('공급자별 시작 주소로 이동하는 링크를 보여준다', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com/admin');
      render(<LoginForm callbackUrl="/" />);

      expect(screen.getByRole('link', { name: 'Google로 로그인' })).toHaveAttribute(
        'href',
        'https://api.example.com/admin/auth/oauth/google/authorize',
      );
      expect(screen.getByRole('link', { name: 'GitHub로 로그인' })).toHaveAttribute(
        'href',
        'https://api.example.com/admin/auth/oauth/github/authorize',
      );
    });

    it('API 주소가 없으면 깨진 링크를 만들지 않는다', () => {
      vi.stubEnv('NEXT_PUBLIC_API_URL', '');
      render(<LoginForm callbackUrl="/" />);

      expect(screen.queryByRole('link', { name: /로그인/ })).not.toBeInTheDocument();
    });

    it('서버가 알려준 거절 코드를 안내 문구로 보여준다', () => {
      render(<LoginForm callbackUrl="/" error="ACCESS_DENIED" />);

      expect(screen.getByRole('alert')).toHaveTextContent('등록된 관리자 계정이 아닙니다');
    });

    it('오류 코드가 없으면 안내를 보여주지 않는다', () => {
      render(<LoginForm callbackUrl="/" />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('이메일과 비밀번호 폼은 두 공급자 로그인이 확인될 때까지 남겨 둔다', () => {
      render(<LoginForm callbackUrl="/" />);

      expect(screen.getByLabelText('이메일')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    });
  });
});
