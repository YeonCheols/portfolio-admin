'use client';
import dayjs from 'dayjs';
import { isEqual } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Table } from '@/components/ui/table';
import { projectTableHeader } from '@/data/table/project';
import { type AdminProjectOrderUpdateRequest, type AdminProjectResponse } from '@/docs/api';
import { deleteData, patchData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { useTableStore } from '@/lib/zustand/table';
import { type ProjectTableData } from '@/types/project';

export default function Project() {
  const router = useRouter();

  const { table, checkbox, setTable } = useTableStore();
  const { data, isLoading, mutate } = useSWR<{ data: AdminProjectResponse[] }>(`/api/project?page=1&size=5`, fetcher);

  const handleChangeStatus = async (request: ProjectTableData) => {
    toast('프로젝트 상태 변경 진행 중...');
    const { slug, isShow } = request;
    const response = await patchData('/api/project/show', { slug, isShow: !isShow });
    await mutate();

    if (response.status === 200) {
      toast.success('프로젝트 상태 변경 완료');
    } else {
      toast.error(`프로젝트 상태 변경 실패 : ${response.error}`);
    }
  };

  const handleDelete = async (slug: ProjectTableData['slug']) => {
    toast('프로젝트 삭제 진행 중...');
    const response = await deleteData(`/api/project/delete?slug=${slug}`);
    await mutate();

    if (response.status === 200) {
      toast.success('프로젝트 삭제 완료');
    } else {
      toast.error(`프로젝트 삭제 실패 : ${response.error}`);
    }
  };

  const handleDownImg = async () => {
    if (!data?.data) {
      return;
    }
    if (checkbox.length === 0) {
      toast.error('다운로드할 프로젝트를 선택해주세요.');
      return;
    }
    if (checkbox.length > 1) {
      toast.error(
        <>
          이미지 다운로드는 <br />
          하나의 프로젝트에서만 가능합니다.
        </>,
        { position: 'bottom-left' },
      );
      return;
    }

    const { image } =
      data?.data?.filter(item => item.slug === checkbox.find(checkbox => checkbox.checked)?.value)[0] || {};
    if (!image) {
      toast.error('이미지 url을 찾을 수 없습니다.', { position: 'bottom-left' });
      return;
    }
    const a = document.createElement('a');
    a.href = image + '?download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOrderUp = async (item: AdminProjectOrderUpdateRequest) => {
    toast('프로젝트 정렬 변경 중...');

    console.info('item : ', item);
    console.info('up');

    await patchData(`/api/project/order`, item);
    await mutate();

    toast('프로젝트 정렬 변경 완료');
  };

  const handleOrderDown = async (item: AdminProjectOrderUpdateRequest) => {
    toast('프로젝트 정렬 변경 중...');

    console.info('item : ', item);
    console.info('down');

    await patchData(`/api/project/order`, item);
    await mutate();

    toast('프로젝트 정렬 변경 완료');
  };

  const projectTableData = useMemo(() => {
    if (!data?.data) {
      return [];
    }
    return data.data.map((item, index) => {
      return {
        id: {
          checkbox: {
            id: `checkbox-${item.id}`,
            value: item.slug,
            checked: false,
          },
        },
        order: (
          <div className="flex items-center text-center gap-[8px]">
            {item.order}
            <div>
              {item.order < data.data.length && (
                <FaAngleUp
                  size={16}
                  role="button"
                  onClick={() =>
                    handleOrderUp({
                      nextSlug: item.slug,
                      nextOrderNo: item.order + 1,
                      prevSlug: data.data.filter(current => current.order === item.order + 1)[0].slug,
                      prevOrderNo: item.order,
                    })
                  }
                />
              )}
              {data.data.length - 1 !== index && (
                <FaAngleDown
                  size={16}
                  role="button"
                  onClick={() =>
                    handleOrderDown({
                      nextSlug: item.slug,
                      nextOrderNo: item.order - 1,
                      prevSlug: data.data.filter(current => current.order === item.order - 1)[0].slug,
                      prevOrderNo: item.order,
                    })
                  }
                />
              )}
            </div>
          </div>
        ),
        title: item.title,
        slug: {
          link: {
            title: item.slug,
            href: `/project/preview/${item.slug}`,
          },
        },
        stack: JSON.parse(item.stacks).join(', '),
        linkGithub: {
          link: {
            title: item.linkGithub,
            href: item.linkGithub,
            target: '_blank',
          },
        },
        linkDemo: {
          link: {
            title: item.linkDemo,
            href: item.linkDemo,
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
        isShow: {
          status: {
            status: item.isShow,
            title: item.isShow ? '발행' : '미발행',
          },
        },
        updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
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
  }, [data, router]);

  // refetch 시 table store 동기화
  useEffect(() => {
    if (!isEqual(projectTableData, table.body) && table.body.length > 0) {
      setTable({
        header: projectTableHeader,
        body: projectTableData,
      });
    }
  }, [projectTableData, table.body]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Button variant="secondary" className="mb-4" onClick={() => router.push('/project/create')}>
        새 글 작성하기
      </Button>
      <Button
        variant="ghost"
        className="ml-4 bg-gray-200 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-600"
        onClick={handleDownImg}
      >
        이미지 다운로드
      </Button>

      {projectTableData.length > 0 && (
        <Table
          table={{
            header: projectTableHeader,
            body: projectTableData,
            draggableOption: {
              draggable: true,
              'data-value': {
                slug: 'test',
                order: 1,
              },
              onDragStart: event => {
                console.info('onDragStart', event.currentTarget.dataset);
              },
              onDragEnd: event => {
                console.info('onDragEnd', event.currentTarget.dataset);
              },
            },
          }}
        />
      )}
    </>
  );
}
