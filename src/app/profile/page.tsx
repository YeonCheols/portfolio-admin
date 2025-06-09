'use client';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Table } from '@/components/ui/table';
import { profileTableHeader } from '@/data/table/profile';
import { type AdminProfileOrderUpdateRequest, type AdminProfileResponse } from '@/docs/api';
import { patchData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { useTableStore } from '@/lib/zustand/table';

export default function Project() {
  const router = useRouter();

  const { checkbox } = useTableStore();
  const { data, isLoading, mutate } = useSWR<{ data: AdminProfileResponse[] }>(`/api/profile?page=1&size=5`, fetcher);

  const handleChangeStatus = async (request: AdminProfileResponse) => {
    toast('프로젝트 상태 변경 진행 중...');
    // const { slug, isShow } = request;
    // const response = await patchData('/api/project/show', { slug, isShow: !isShow });
    // await mutate();

    // if (response.status === 200) {
    //   toast.success('프로젝트 상태 변경 완료');
    // } else {
    //   toast.error(`프로젝트 상태 변경 실패 : ${response.error}`);
    // }
  };

  const handleDelete = async (slug: AdminProfileResponse['id']) => {
    // toast('프로젝트 삭제 진행 중...');
    // const response = await deleteData(`/api/project/delete?slug=${slug}`);
    // await mutate();
    // if (response.status === 200) {
    //   toast.success('프로젝트 삭제 완료');
    // } else {
    //   toast.error(`프로젝트 삭제 실패 : ${response.error}`);
    // }
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
          하나의 프로필만 가능합니다.
        </>,
        { position: 'bottom-left' },
      );
      return;
    }

    const { imageUrl } =
      data?.data?.filter(item => String(item.id) === checkbox.find(checkbox => checkbox.checked)?.value)[0] || {};
    if (!imageUrl) {
      toast.error('이미지 url을 찾을 수 없습니다.', { position: 'bottom-left' });
      return;
    }
    const a = document.createElement('a');
    a.href = imageUrl + '?download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSortData = async (item: AdminProfileOrderUpdateRequest) => {
    toast('프로젝트 정렬 변경 중...');

    const response = await patchData(`/api/project/order`, item);
    await mutate();

    if (response.status === 200) {
      toast.success('프로젝트 정렬 변경 완료');
    } else {
      toast.error(`프로젝트 정렬 변경 실패 : ${response.error}`);
    }
  };

  const profileTableData = useMemo(() => {
    if (!data?.data) {
      return [];
    }
    return data.data.map(item => ({
      id: {
        checkbox: {
          id: `checkbox-${item.id}`,
          value: String(item.id),
          checked: false,
        },
      },
      img: (
        <>
          <Image src={item.imageUrl} alt="profile" className="mr-2 rounded-full" width={36} height={36} />
          <div className="ps-3">
            <div className="text-base font-semibold">Neil Sims</div>
          </div>
        </>
      ),
      // imageUrl: {
      //   link: {
      //     title: item.imageUrl,
      //     href: item.imageUrl,
      //   },
      // },
      isShow: {
        status: {
          status: item.isActive,
          title: item.isActive ? '사용' : '미사용',
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
            onClick={() => router.push(`/project/edit?slug=${item.id}`)}
          >
            수정
          </Button>
          <br />
          <Button
            variant="secondary"
            className="bg-red-300 dark:bg-red-500 hover:bg-red-400 dark:hover:bg-red-600 mb-2"
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            삭제
          </Button>
        </>
      ),
    }));
  }, [data, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Button variant="secondary" className="mb-4" onClick={() => router.push('/project/create')}>
        프로필 생성
      </Button>
      <Button
        variant="ghost"
        className="ml-4 bg-gray-200 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-600"
        onClick={handleDownImg}
      >
        프로필 다운로드
      </Button>

      {profileTableData.length > 0 && (
        <Table
          table={{
            header: profileTableHeader,
            body: profileTableData,
          }}
        />
      )}
    </>
  );
}
