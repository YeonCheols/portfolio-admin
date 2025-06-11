import { type ReactElement } from 'react';
import { Toast } from '../toast';

export default function AppContainer({ children }: { children: ReactElement[] | ReactElement }) {
  return (
    <>
      <div id="modal" />
      <div id="toast">
        <Toast />
      </div>
      <div className="flex min-h-[100dvh]">{children}</div>
    </>
  );
}
