const fallback = '/';

/** 로그인 뒤 이동 경로는 같은 사이트 안의 경로만 허용합니다. */
export function safeCallbackUrl(value?: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;
  // 역슬래시는 브라우저가 슬래시로 읽어 외부 주소가 될 수 있고, 제어 문자는 헤더·경로를 깨뜨린다
  if (value.includes('\\') || [...value].some(char => char.charCodeAt(0) <= 0x1f || char.charCodeAt(0) === 0x7f)) {
    return fallback;
  }
  return value;
}
