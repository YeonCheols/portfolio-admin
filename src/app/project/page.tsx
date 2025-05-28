'use client';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { projectTableHeader } from '@/data/table/project';
import { deleteData, patchData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { type ProjectData } from '@/types/project';

export default function Project() {
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR<{ data: ProjectData[] }>(`/api/project?page=1&size=5`, fetcher);

  const handleChangeStatus = async (request: ProjectData) => {
    toast('프로젝트 상태 변경 진행 중...');
    const { slug, is_show } = request;
    const response = await patchData('/api/project/show', { slug, is_show: !is_show });
    await mutate();

    if (response.status === 200) {
      toast.success('프로젝트 상태 변경 완료');
    } else {
      toast.error(`프로젝트 상태 변경 실패 : ${response.error}`);
    }
  };

  const handleDelete = async (slug: ProjectData['slug']) => {
    toast('프로젝트 삭제 진행 중...');
    const response = await deleteData(`/api/project/delete?slug=${slug}`);
    await mutate();

    if (response.status === 200) {
      toast.success('프로젝트 삭제 완료');
    } else {
      toast.error(`프로젝트 삭제 실패 : ${response.error}`);
    }
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
      ...(item.content
        ? {
            contents: {
              link: {
                title: item.content?.length > 10 ? item.content.slice(0, 10) + '...' : item.content,
                href: `/project/write/${item.slug}`,
              },
            },
          }
        : {
            contents: (
              <Button
                variant="secondary"
                className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-600 mb-2"
                size="sm"
                onClick={() => router.push(`/project/write/${item.slug}`)}
              >
                내용 작성
              </Button>
            ),
          }),
      description: item.description,
      is_show: {
        status: {
          status: item.is_show,
          title: item.is_show ? '발행' : '미발행',
        },
      },
      updated_at: dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      buttonGroup: (
        <>
          <Button
            variant="secondary"
            className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-600 mb-2"
            size="sm"
            onClick={() => handleChangeStatus(item)}
          >
            변경
          </Button>
          <br />
          <Button
            variant="secondary"
            className="bg-green-200 dark:bg-green-500 hover:bg-green-400 dark:hover:bg-green-600 mb-2"
            size="sm"
            onClick={() => router.push(`/project/edit?slug=${item.slug}`)}
          >
            수정
          </Button>
          <br />
          <Button
            variant="secondary"
            className="bg-red-300 dark:bg-red-500 hover:bg-red-400 dark:hover:bg-red-600 mb-2"
            size="sm"
            onClick={() => handleDelete(item.slug)}
          >
            삭제
          </Button>
        </>
      ),
    };
  });

  return (
    <>
      <Button variant="secondary" className="mb-4" onClick={() => router.push('/project/create')}>
        새 글 작성하기
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
