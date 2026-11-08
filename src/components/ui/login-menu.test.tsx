import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginWithButton } from './login-menu';

const push = vi.fn();
const refresh = vi.fn();
const postData = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock('@/lib/api', () => ({ postData: (...args: unknown[]) => postData(...args) }));

beforeAll(() => {
  // Radix 메뉴가 jsdom에 없는 브라우저 API를 요구한다
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.HTMLElement.prototype.hasPointerCapture ??= () => false;
  window.HTMLElement.prototype.scrollIntoView ??= () => {};
});

const openMenu = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /Toggle User/ }));
  return user;
};

describe('LoginWithButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postData.mockResolvedValue({});
  });

  it('로그인 상태에서는 로그아웃만 보여준다', async () => {
    render(<LoginWithButton />);
    await openMenu();

    expect(await screen.findByRole('menuitem', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Login' })).not.toBeInTheDocument();
  });

  it('로그아웃 상태에서는 로그인만 보여준다', async () => {
    render(<LoginWithButton isLoggedIn={false} />);
    await openMenu();

    expect(await screen.findByRole('menuitem', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Logout' })).not.toBeInTheDocument();
  });

  it('로그아웃하면 로그아웃 요청 뒤 로그인 화면으로 이동한다', async () => {
    render(<LoginWithButton />);
    const user = await openMenu();

    await user.click(await screen.findByRole('menuitem', { name: 'Logout' }));

    await waitFor(() => expect(postData).toHaveBeenCalledWith('/user/logout', {}, true));
    expect(push).toHaveBeenCalledWith('/login');
  });
});
