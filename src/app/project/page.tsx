'use client';
import { StackIcon } from '@yeoncheols/portfolio-core-ui';
import dayjs from 'dayjs';
import { isArray, isEqual } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { INITIAL_PAGINATION } from '@/data/paging';
import { projectTableHeader } from '@/data/table/project';
import {
  type AdminTagResponse,
  type AdminProjectOrderUpdateRequest,
  type AdminProjectResponse,
  type AdminProjectSearchResponse,
} from '@/docs/api';
import { deleteData, patchData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { swapArrayElements } from '@/lib/utils';
import { useTableStore } from '@/lib/zustand/table';
import { type ProjectTableData } from '@/types/project';

export default function Project() {
  const router = useRouter();

  const { table, checkbox, setBody } = useTableStore();

  const { data, isLoading, mutate } = useSWR<{ data: AdminProjectSearchResponse }>(
    `/api/project?page=${table.pagination?.page || INITIAL_PAGINATION['PAGE']}&size=${
      table.pagination?.size || INITIAL_PAGINATION['SIZE']
    }`,
    fetcher,
  );
  const { data: stacksData } = useSWR<{ data: AdminTagResponse[] }>(`/api/stacks`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const allCount = useRef<number>(0);

  // 스택 이름으로 메타데이터 찾기
  const getStackMetadata = (stackName: string) => {
    return stacksData?.data.find(stack => stack.name === stackName) || { name: stackName, icon: '', color: '' };
  };

  const handleChangeStatus = async (request: ProjectTableData) => {
    const { slug, isShow } = request;
    await patchData('/api/project/show', { slug, isShow: !isShow });
    await mutate();
  };

  const handleDelete = async (slug: ProjectTableData['slug']) => {
    await deleteData(`/api/project/delete?slug=${slug}`);
    await mutate();
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
      data?.data?.data.filter(item => item.slug === checkbox.find(checkbox => checkbox.checked)?.value)[0] || {};
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

  const handleSortData = async (item: AdminProjectOrderUpdateRequest) => {
    await patchData(`/api/project/order`, item);
    await mutate();
  };

  const mapProjectTableData = (
    projects: AdminProjectResponse[],
    router: any,
    handleSortData: (item: AdminProjectOrderUpdateRequest) => void,
    handleChangeStatus: (item: AdminProjectResponse) => void,
    handleDelete: (slug: string) => void,
    dataLength: number,
  ) => {
    if (!isArray(projects)) {
      return [];
    }
    return projects.map((item, index) => {
      const stacksArray = JSON.parse(item.stacks);

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
              {item.order < dataLength && (
                <FaAngleUp
                  size={16}
                  role="button"
                  onClick={() =>
                    handleSortData({
                      nextSlug: item.slug,
                      nextOrderNo: item.order + 1,
                      prevSlug: projects.filter(current => current.order === item.order + 1)[0].slug,
                      prevOrderNo: item.order,
                    })
                  }
                />
              )}
              {dataLength - 1 !== index && (
                <FaAngleDown
                  size={16}
                  role="button"
                  onClick={() =>
                    handleSortData({
                      nextSlug: item.slug,
                      nextOrderNo: item.order - 1,
                      prevSlug: projects.filter(current => current.order === item.order - 1)[0].slug,
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
        stack: (
          <div className="flex flex-wrap items-center gap-1">
            {stacksArray.map((stack: string, stackIndex: number) => {
              const metadata = getStackMetadata(stack);
              return (
                <StackIcon
                  key={stackIndex}
                  name={metadata.name}
                  icon={metadata.icon}
                  color={metadata.color}
                  size={16}
                  className="hover:scale-110 transition-transform"
                />
              );
            })}
          </div>
        ),
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
  };

  const projectTableData = useMemo(() => {
    if (!data?.data) {
      return [];
    }
    return mapProjectTableData(
      data.data.data,
      router,
      handleSortData,
      handleChangeStatus,
      handleDelete,
      data.data.total,
    );
  }, [data, stacksData, router]);

  useEffect(() => {
    if (!isEqual(projectTableData, table.body)) {
      setBody(projectTableData);
    }
  }, [projectTableData]);

  useEffect(() => {
    if (data?.data) {
      allCount.current = data?.data.allTotal;
    }
  }, [data?.data]);

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

      <Table
        isLoading={isLoading}
        table={{
          header: projectTableHeader,
          body: projectTableData,
          pagination: {
            allTotal: allCount.current ?? INITIAL_PAGINATION['ALL_TOTAL'],
            total: data?.data.total ?? INITIAL_PAGINATION['TOTAL'],
            page: table.pagination?.page ?? INITIAL_PAGINATION['PAGE'],
            size: table.pagination?.size ?? INITIAL_PAGINATION['SIZE'],
          },
          draggableOption: {
            draggable: true,
            onDrop: async result => {
              const { source, destination } = result;

              // target data 없으면 반환
              if (!data?.data || !destination) {
                return;
              }

              // NOTE: 순서를 변경한 table data를 store 에 업데이트 함
              const newData = swapArrayElements<AdminProjectResponse>(
                data?.data.data || [],
                source.index,
                destination?.index,
              );
              setBody(
                mapProjectTableData(newData, router, handleSortData, handleChangeStatus, handleDelete, data.data.total),
              );

              handleSortData({
                nextSlug: data.data.data[source.index].slug,
                nextOrderNo: data.data.data[destination.index].order,
                prevSlug: data.data.data[destination.index].slug,
                prevOrderNo: data.data.data[source.index].order,
              });
            },
          },
        }}
      />
    </>
  );
}
