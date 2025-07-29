'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { TopNav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Editor } from '@/components/ui/editor';
import { Skeleton } from '@/components/ui/skeleton';
import { patchData, postData } from '@/lib/api';
import { usePropsContext } from '@/lib/context/props';
import { fetcher } from '@/lib/fetcher';

export default function ProjectEditContent() {
  const { setContextProps } = usePropsContext();
  const { theme } = useTheme();

  const router = useRouter();
  const params = useParams();

  const { data, isLoading } = useSWR<{ data: { title: string; content: string; image: string } }>(
    `/api/project/slug?slug=${params.slug}`,
    fetcher,
  );

  const [content, setContent] = useState('');

  const handleChangeContent = (markdown: string) => {
    setContent(markdown);
  };
  const handleContentSave = async () => {
    const response = await patchData(`/api/project/edit`, {
      content,
      slug: params.slug,
    });
    if (response.status !== 200) {
      throw new Error('프로젝트 수정에 실패했습니다.');
    }
    router.push('/project');
  };

  const handleSpellCheck = async () => {
    const result = await postData('/api/spell-check', { content }, false, {
      loadingMsg: '맞춤법 검사 중...',
      successMsg: '맞춤법 검사가 완료되었습니다.',
      errorMsg: '맞춤법 검사에 실패했습니다.',
    });
    console.info('result : ', result);
  };

  useEffect(() => {
    if (data?.data?.content) {
      setContent(data?.data?.content);
    }
  }, [data]);

  useEffect(() => {
    setContextProps({ noneLayout: true, header: <TopNav title="프로젝트 내용 수정" /> });
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div data-color-mode={theme}>
            <Editor markdown={content} onEditorChange={handleChangeContent} height={700} />
          </div>
          <Button variant="secondary" size="lg" className="mt-8" onClick={handleContentSave}>
            출간하기
          </Button>

          <Button variant="secondary" size="lg" className="mt-8 ml-8" onClick={handleSpellCheck}>
            맞춤법 검사
          </Button>
        </>
      )}
    </>
  );
}
