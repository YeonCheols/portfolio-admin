'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { TopNav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Editor } from '@/components/ui/editor';
import { Skeleton } from '@/components/ui/skeleton';
import { patchData } from '@/lib/api';
import { usePropsContext } from '@/lib/context/props';
import { fetcher } from '@/lib/fetcher';

export default function ProjectEditContent() {
  const { setContextProps } = usePropsContext();

  const router = useRouter();
  const params = useParams();

  const { data, isLoading } = useSWR<{ data: { title: string; content: string; image: string } }>(
    `/api/project/slug?slug=${params.slug}`,
    fetcher,
  );

  const [content, setContent] = useState('');

  const handleChangeContent = (markdown: string) => {
    if (data?.data?.content) {
      setContent(markdown);
    }
  };
  const handleContentSave = async () => {
    toast('프로젝트 수정 진행 중...');
    try {
      const response = await patchData(`/api/project/edit`, {
        content,
        slug: params.slug,
      });

      if (response.status !== 200) {
        throw new Error('프로젝트 수정에 실패했습니다.');
      }

      toast.success('프로젝트가 수정 되었습니다.');
      router.push('/project');
    } catch {
      toast.error('프로젝트 수정중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (data?.data?.content) {
      setContent(data?.data?.content);
    }
  }, [data]);

  useEffect(() => {
    setContextProps({ header: <TopNav title="글 수정" /> });
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div className="bg-gray-300 dark:bg-white rounded-lg">
            <Editor markdown={data?.data?.content || ''} onChange={handleChangeContent} />
          </div>
          <Button variant="secondary" className="mt-4" onClick={handleContentSave}>
            출간하기
          </Button>
        </>
      )}
    </>
  );
}
