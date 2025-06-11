'use client';

import Container from '../container';
import { ThemeToggle } from '../theme-toggle';
import { cn } from '@/lib/utils';
import { type Navigation } from '@/types/navigation';

export default function TopNav({ title, isTheme = true, className }: Navigation) {
  return (
    <Container className={cn('flex h-16 items-center justify-between border-b border-border', className)}>
      <h1 className="text-2xl font-medium">{title}</h1>
      {isTheme && <ThemeToggle />}
    </Container>
  );
}
