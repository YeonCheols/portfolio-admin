import { Gabarito } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { type ReactElement } from 'react';
import AppLayout from '@/components/ui/app/layout';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactElement;
}>) {
  // NOTE: 로그인 인증 여부
  const cookieStore = await cookies();
  const callbackUrl = cookieStore.get('callbackUrl')?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('bg-background font-sans', gabarito.variable)}>
        <Providers>
          <AppLayout isLogin={!!callbackUrl}>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
