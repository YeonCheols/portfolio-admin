'use client';

import { type ReactElement } from 'react';
import { SideNav } from '../../nav';
import AppContainer from './container';

export default function AppLayout({ children }: { children: ReactElement }) {
  // if (!session?.data?.user) {
  //   return (
  //     <AppContainer>
  //       <div className="flex-grow overflow-auto">{children}</div>
  //     </AppContainer>
  //   );
  // }

  return (
    <>
      <AppContainer>
        <SideNav />
        <div className="flex-grow overflow-auto">{children}</div>
      </AppContainer>
    </>
  );
}
