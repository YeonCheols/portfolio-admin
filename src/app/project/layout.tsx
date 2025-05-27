'use client';

import Container from '@/components/container';
import { TopNav } from '@/components/nav';
import { usePropsContext } from '@/lib/context/props';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { contextProps } = usePropsContext<{ header: React.ReactNode }>();

  return (
    <>
      {contextProps && contextProps?.header ? contextProps.header : <TopNav title="프로젝트 목록" />}
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
