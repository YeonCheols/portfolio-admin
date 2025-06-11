'use server';

import { cookies } from 'next/headers';

/**
 * 로그인 필요 시 발급되는 쿠키
 * 필요 시 데이터 조회 할 것
 * @returns 로그인 후 리다이렉트 URL
 */
export async function getLoginRedirectUrl() {
  const cookieStore = await cookies();
  return cookieStore.get('callbackUrl')?.value;
}
