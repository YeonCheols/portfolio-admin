'use client';

import Container from '../container';
import { ThemeToggle } from '../theme-toggle';
import { LoginWithButton } from '@/components/ui/login-toggle';
import { cn } from '@/lib/utils';
import { type Navigation } from '@/types/navigation';

export default function TopNav({ title, isTheme = true, isLogin = true, className }: Navigation) {
  return (
    <Container className={cn('flex h-16 items-center border-b border-border', className)}>
      <h1 className="text-2xl font-medium flex-none">{title}</h1>
      <div className="flex justify-end w-full gap-2">
        {isLogin && <LoginWithButton />}
        {isTheme && <ThemeToggle />}
      </div>
    </Container>
  );
}
