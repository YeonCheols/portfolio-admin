'use server';

import { LoginForm } from '@/components/ui/login-form';

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return <LoginForm error={params.error} />;
}
