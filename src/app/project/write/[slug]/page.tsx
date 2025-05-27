'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { TopNav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Editor } from '@/components/ui/editor';
import { usePropsContext } from '@/lib/context/props';
import { fetcher } from '@/lib/fetcher';

export default function ProjectEditContent() {
  const { setContextProps } = usePropsContext();

  const params = useParams();
  const { data } = useSWR<{ data: { title: string; content: string; image: string } }>(
    `/api/project/slug?slug=${params.slug}`,
    fetcher,
  );

  const handleContentSave = () => {
    console.info('save');
  };

  useEffect(() => {
    setContextProps({ header: <TopNav title="새 글 작성" /> });
  }, []);

  return (
    <>
      <div className="bg-gray-300 dark:bg-white rounded-lg">
        <Editor markdown={data?.data?.content || ''} />
      </div>
      <Button variant="secondary" className="mt-4" onClick={handleContentSave}>
        출간하기
      </Button>
    </>
  );
}
