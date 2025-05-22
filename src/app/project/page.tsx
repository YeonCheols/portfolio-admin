'use client';

import dayjs from 'dayjs';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { projectTableHeader } from '@/data/table/project';
import { fetcher } from '@/lib/fetcher';
import { useState, type ReactElement } from 'react';
import { patchData } from '@/lib/api';
import { Toast } from '@/components/ui/toast';

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
  buttonGroup: ReactElement;
}

export default function Project() {
  const router = useRouter();
  const [retry, setRetry] = useState(false);

  const { data, isLoading, mutate } = useSWR<{ data: ProjectData[] }>(`/api/project?page=1&size=5`, fetcher);

  const handleChangeStatus = async (request: ProjectData) => {
    setRetry(true);
    const { slug, is_show } = request;
    await patchData('/api/project/show', { slug, is_show: !is_show });
    await mutate();
    setRetry(false);
  };

  const projectTableData = data?.data.map(item => {
    return {
      id: item.id,
      title: item.title,
      slug: {
        link: {
          title: item.slug,
          href: `/project/preview/${item.slug}`,
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
      updated_at: dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      buttonGroup: (
        <>
          <Button variant="secondary" className="bg-gray-500 mb-2" size="sm" onClick={() => handleChangeStatus(item)}>
            상태 변경
          </Button>
          <br />
          <Button
            variant="secondary"
            className="bg-green-500 mb-2"
            size="sm"
            onClick={() => router.push(`/project/edit?slug=${item.slug}`)}
          >
            수정
          </Button>
          <br />
          <Button
            variant="secondary"
            className="bg-red-500 mb-2"
            size="sm"
            onClick={() => router.push('/project/delete')}
          >
            삭제
          </Button>
        </>
      ),
    };
  });

  return (
    <>
      <Toast type="success" message="프로젝트 생성 완료" />
      <Button variant="secondary" className="mb-4" onClick={() => router.push('/project/create')}>
        추가하기
      </Button>
      <Table
        table={{
          header: projectTableHeader,
          body: projectTableData || [],
        }}
        isLoading={isLoading}
      />
    </>
  );
}
