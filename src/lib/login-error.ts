const messages: Record<string, string> = {
  ACCESS_DENIED: '등록된 관리자 계정이 아닙니다. 관리자에게 문의해주세요.',
  AUTH_FAILED: '로그인에 실패했습니다. 다시 시도해주세요.',
};

/** 서버가 `/login?error=`로 보낸 안전한 코드만 안내 문구로 바꾸고, 알 수 없는 값은 그대로 보여주지 않는다. */
export function loginErrorMessage(code?: string | null): string | null {
  if (!code) return null;
  return messages[code] ?? messages.AUTH_FAILED;
}
