'use server';

import { LoginForm } from '@/components/ui/login-form';

export default async function Login({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || '/';

  return <LoginForm callbackUrl={callbackUrl} />;
}
