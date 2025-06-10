'use client';

import Container from '@/components/container';
import { TopNav } from '@/components/nav';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav title="로그인 관리" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
