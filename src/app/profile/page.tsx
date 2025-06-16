'use client';
import dayjs from 'dayjs';
import { isArray, isEqual } from 'lodash-es';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Table } from '@/components/ui/table';
import { WaringInfo } from '@/components/ui/waring-info';
import { profileTableHeader } from '@/data/table/profile';
import { type AdminProfileResponse } from '@/docs/api';
import { deleteData, patchData } from '@/lib/api';
import { fetcher } from '@/lib/fetcher';
import { downloadFile } from '@/lib/file/downloadFile';
import { resizeFile } from '@/lib/file/resizeFile';
import { useTableStore } from '@/lib/zustand/table';

export default function Profile() {
  const router = useRouter();

  const { table, checkbox, setBody } = useTableStore();
  const { data, isLoading, mutate } = useSWR<{ data: AdminProfileResponse[] }>(`/api/profile?page=1&size=5`, fetcher);

  const handleChangeStatus = async (request: AdminProfileResponse) => {
    toast('프로필 상태 변경 진행 중...');
    const { id, isActive } = request;
    const response = await patchData('/api/profile/show', { id, isActive: !isActive });
    await mutate();

    if (response.status === 200) {
      toast.success('프로필 상태 변경 완료');
    } else if (response.error.status === 400) {
      toast.error('프로필은 1개만 활성화 하실 수 있습니다.');
    } else {
      toast.error(`프로필 상태 변경 실패 : ${response.error}`);
    }
  };

  const handleDelete = async (slug: AdminProfileResponse['id']) => {
    toast('프로필 삭제 진행 중...');
    const response = await deleteData(`/api/profile/delete?slug=${slug}`);
    await mutate();
    if (response.status === 200) {
      toast.success('프로필 삭제 완료');
    } else {
      toast.error(`프로필 삭제 실패 : ${response.error}`);
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

    downloadFile({ type: 'url', url: imageUrl });
  };

  const handleResizeFile = async (e: React.FormEvent<HTMLInputElement>) => {
    toast('이미지 압축 진행 중...');

    try {
      await resizeFile(e.currentTarget?.files?.[0] as File);
      toast.success('이미지 압축 성공');
    } catch {
      toast.error('이미지 압축 중 오류가 발생했습니다.');
    }
  };

  const profileTableData = useMemo(() => {
    if (!data?.data || !isArray(data.data)) {
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
        <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
          {item.imageUrl && (
            <NextImage
              src={item.imageUrl}
              alt="profile"
              className="mr-2 rounded-full"
              width={40}
              height={40}
              unoptimized
            />
          )}
          <div className="ps-3">
            <a
              href={item.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tet-blue-600 hover:underline hover:font-semibold transition-colors duration-200"
            >
              <span className="text-base font-semibold">{item.name}</span>
            </a>
          </div>
        </div>
      ),
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
            onClick={() => router.push(`/profile/edit?id=${item.id}`)}
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

  useEffect(() => {
    if (!isEqual(profileTableData, table.body)) {
      setBody(profileTableData);
    }
  }, [profileTableData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <WaringInfo
        headTitle="이미지 업로드"
        description={
          <>
            이미지는 최대 1MB 까지 업로드 하실 수 있습니다.
            <br /> 용량 압축은 아래 파일 업로드 버튼을 클릭하여 진행해주세요.
          </>
        }
      >
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="resize"
          type="file"
          onChange={handleResizeFile}
          accept="image/*"
        />
      </WaringInfo>

      <Button variant="secondary" className="mb-4" onClick={() => router.push('/profile/create')}>
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
