import { Gabarito } from 'next/font/google';
import { SideNav } from '@/components/nav';
import { Toast } from '@/components/ui/toast';
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('bg-background font-sans', gabarito.variable)}>
        <Providers>
          <div id="modal" />
          <div id="toast">
            <Toast />
          </div>
          <div className="flex min-h-[100dvh]">
            <SideNav />
            <div className="flex-grow overflow-auto">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
