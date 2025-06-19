'use client';

import { Provider as JotaiProvider } from 'jotai';
import { ChartThemeProvider } from '@/components/providers/chart-theme-provider';
import { ModeThemeProvider } from '@/components/providers/mode-theme-provider';
import { PropsProvider } from '@/lib/context/props';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PropsProvider>
      <JotaiProvider>
        <ModeThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ChartThemeProvider>{children}</ChartThemeProvider>
        </ModeThemeProvider>
      </JotaiProvider>
    </PropsProvider>
  );
}
