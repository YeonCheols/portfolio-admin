import Container from '@/components/container';
import { TopNav } from '@/components/nav';

export default function StacksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav title="스택 관리" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
