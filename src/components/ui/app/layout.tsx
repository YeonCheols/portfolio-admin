'use client';

import dynamic from 'next/dynamic';
import { type ReactElement } from 'react';
import { SideNav } from '../../nav';
import AppContainer from './container';

const ProgressBar = dynamic(() => import('@/components/ui/progressbar'), { ssr: false });

export default function AppLayout({ children, isLogin }: { children: ReactElement; isLogin: boolean }) {
  if (!isLogin) {
    return (
      <AppContainer>
        <ProgressBar />
        <div className="flex-grow overflow-auto">{children}</div>
      </AppContainer>
    );
  }

  return (
    <>
      <AppContainer>
        <ProgressBar />
        <SideNav />
        <div className="flex-grow overflow-auto">{children}</div>
      </AppContainer>
    </>
  );
}
