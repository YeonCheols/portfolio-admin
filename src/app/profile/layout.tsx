'use client';

import Container from '@/components/container';
import { TopNav } from '@/components/nav';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav title="프로필 관리" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
