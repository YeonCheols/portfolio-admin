import { describe, expect, it } from 'vitest';
import { loginErrorMessage } from './login-error';

describe('loginErrorMessage', () => {
  it('등록된 관리자가 아니면 거절 안내를 보여준다', () => {
    expect(loginErrorMessage('ACCESS_DENIED')).toBe('등록된 관리자 계정이 아닙니다. 관리자에게 문의해주세요.');
  });

  it('인증 실패는 다시 시도하라는 안내를 보여준다', () => {
    expect(loginErrorMessage('AUTH_FAILED')).toBe('로그인에 실패했습니다. 다시 시도해주세요.');
  });

  it.each([undefined, null, ''])('오류 코드가 없으면(%j) 안내를 보여주지 않는다', code => {
    expect(loginErrorMessage(code)).toBeNull();
  });

  it('알 수 없는 코드는 값을 그대로 보여주지 않고 일반 안내로 바꾼다', () => {
    const message = loginErrorMessage('<script>alert(1)</script>');

    expect(message).toBe('로그인에 실패했습니다. 다시 시도해주세요.');
    expect(message).not.toContain('script');
  });
});
