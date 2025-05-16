'use client';

import Container from '../container';
import { ThemeToggle } from '../theme-toggle';
import { type Navigation } from '@/types/navigation';

export default function TopNav({ isTheme = true, title }: Navigation) {
  return (
    <Container className="flex h-16 items-center justify-between border-b border-border">
      <h1 className="text-2xl font-medium">{title}</h1>
      {isTheme && <ThemeToggle />}
    </Container>
  );
}
