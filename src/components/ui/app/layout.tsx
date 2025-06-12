'use client';

import { type ReactElement } from 'react';
import { SideNav } from '../../nav';
import AppContainer from './container';
import { useSession } from 'next-auth/react';

export default function AppLayout({ children }: { children: ReactElement }) {
  const { data: session } = useSession();

  if (!session?.user) {
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
