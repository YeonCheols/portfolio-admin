'use client';

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
  const { data, isLoading } = useSWR<{ data: ProjectData[] }>(`/api/project?page=1&size=5`, fetcher);

  const projectTableData = data?.data.map(item => {
    return {
      id: item.id,
      title: item.title,
      slug: {
        link: {
          title: item.slug,
          href: `/project/${item.slug}`,
        },
      },
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
        link: {
          title: item.content?.length > 10 ? item.content.slice(0, 10) + '...' : item.content,
          href: `/project/${item.slug}`,
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
    <Table
      table={{
        header: projectTableHeader,
        body: projectTableData || [],
      }}
      isLoading={isLoading}
    />
  );
}
