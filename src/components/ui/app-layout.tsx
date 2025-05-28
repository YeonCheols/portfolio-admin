'use client';

import { type ReactElement } from 'react';
import { SideNav } from '../nav';
import { usePropsContext } from '@/lib/context/props';
import { Toast } from './toast';

export default function AppLayout({ children }: { children: ReactElement }) {
  const { contextProps } = usePropsContext<{ noneLayout: boolean }>();
  const { noneLayout } = contextProps ?? {};

  if (noneLayout) {
    return (
      <>
        <div id="modal" />
        <div id="toast">
          <Toast />
        </div>
        <div className="flex min-h-[100dvh]">
          <div className="flex-grow overflow-auto">{children}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="modal" />
      <div id="toast">
        <Toast />
      </div>
      <div className="flex min-h-[100dvh]">
        <SideNav />
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </>
  );
}
