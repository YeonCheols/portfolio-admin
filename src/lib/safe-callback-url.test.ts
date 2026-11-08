import { describe, expect, it } from 'vitest';
import { safeCallbackUrl } from './safe-callback-url';

describe('safeCallbackUrl', () => {
  it.each(['/', '/stacks', '/stacks/1?tab=a#top'])('같은 사이트 경로 %s는 그대로 돌려준다', path => {
    expect(safeCallbackUrl(path)).toBe(path);
  });

  it.each([
    'https://example.test',
    '//example.test',
    '/\\example.test',
    '/stacks\\..\\x',
    'javascript:alert(1)',
    'stacks',
    '/stacks\n',
    '',
  ])('안전하지 않은 값 %j는 /로 바꾼다', value => {
    expect(safeCallbackUrl(value)).toBe('/');
  });

  it('값이 없으면 /로 바꾼다', () => {
    expect(safeCallbackUrl(undefined)).toBe('/');
    expect(safeCallbackUrl(null)).toBe('/');
  });
});
