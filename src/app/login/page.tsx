'use server';

import { LoginForm } from '@/components/ui/login';
import { getLoginRedirectUrl } from '@/lib/auth/cookie';
import { headers } from 'next/headers';

export default async function Login() {
  const header = await headers();
  const redirectUrl = decodeURIComponent((await getLoginRedirectUrl()) as string);

  return (
    <LoginForm
      host={`${header.get('x-forwarded-proto')}://${header.get('x-forwarded-host')}`}
      callbackUrl={redirectUrl}
    />
  );
}
