'use client';

import { Loading } from '@/components/ui/loading';
import { Table } from '@/components/ui/table';
import { projectTableHeader } from '@/data/table/project';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';

interface ProjectData {
  id: number;
  title: string;
  slug: string;
  stacks: string;
  link_github: string;
  link_demo: string;
  content: string;
  description: string;
  is_show: boolean;
  updated_at: string;
}

export default function Project() {
  const { data, isLoading } = useSWR<{ data: ProjectData[] }>(`/api/projects?page=1&size=5`, fetcher);

  if (!data) {
    return <Loading />;
  }

  const projectTableData = data.data.map(item => {
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      stack: JSON.parse(item.stacks).join(', '),
      link_github: {
        link: {
          title: item.link_github,
          href: item.link_github,
          target: '_blank',
        },
      },
      link_demo: {
        link: {
          title: item.link_demo,
          href: item.link_demo,
          target: '_blank',
        },
      },
      contents: {
        content: {
          title: item.content,
          isShortTitle: (item.content && item.content.length > 10) || false,
        },
      },
      description: item.description,
      is_show: {
        status: {
          status: item.is_show,
          title: item.is_show ? '사용' : '미사용',
        },
      },
      updated_at: item.updated_at,
    };
  });
  return (
    <div>
      <Table
        table={{
          header: projectTableHeader,
          body: projectTableData,
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
