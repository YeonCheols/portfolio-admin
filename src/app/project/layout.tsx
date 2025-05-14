import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Project" />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
}
