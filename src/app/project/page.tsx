import { Table } from '@/components/ui/table';
import { projectTableHeader } from '@/data/table/project';

export default function Home() {
  return (
    <div>
      <Table data={{ header: projectTableHeader, data: [] }} />
    </div>
  );
}
