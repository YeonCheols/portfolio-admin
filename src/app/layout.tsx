import { Gabarito } from 'next/font/google';
import { type ReactElement } from 'react';
import AppLayout from '@/components/ui/app-layout';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Providers } from './providers';
import type { Metadata } from 'next';
import '@/style/globals.css';

const gabarito = Gabarito({ subsets: ['latin'], variable: '--font-gabarito' });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactElement;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('bg-background font-sans', gabarito.variable)}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
