'use client';

import { type ReactElement } from 'react';
import { SideNav } from '../../nav';
import AppContainer from './container';

export default function AppLayout({ children, isLogin }: { children: ReactElement; isLogin: boolean }) {
  if (isLogin) {
    return (
      <AppContainer>
        <div className="flex-grow overflow-auto">{children}</div>
      </AppContainer>
    );
  }

  return (
    <>
      <AppContainer>
        <SideNav />
        <div className="flex-grow overflow-auto">{children}</div>
      </AppContainer>
    </>
  );
}
