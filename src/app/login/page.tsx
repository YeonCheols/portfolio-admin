'use server';

import { LoginForm } from '@/components/ui/login-form';
import { safeCallbackUrl } from '@/lib/safe-callback-url';

export default async function Login({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);

  return <LoginForm callbackUrl={callbackUrl} />;
}
