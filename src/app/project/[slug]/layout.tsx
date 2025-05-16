import Container from '@/components/container';
import { TopNav } from '@/components/nav';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav title="프로젝트 미리보기" isTheme={false} />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
