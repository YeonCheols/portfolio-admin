'use client';

import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { TopNav } from '@/components/nav';
import { Loading } from '@/components/ui/loading';
import MDXComponent from '@/components/ui/markdown/mdx';
import { usePropsContext } from '@/lib/context/props';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

// TODO: 프로젝트 미리보기 모듈화
export default function ProjectPreview() {
  const { setContextProps } = usePropsContext();
  const params = useParams();

  const { data } = useSWR<{ data: { title: string; content: string; image: string } }>(
    `/api/project/slug?slug=${params.slug}`,
    fetcher,
  );

  useEffect(() => {
    setContextProps({ header: <TopNav title="프로젝트 미리보기" /> });
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="mt-10">
      {data.data?.image && (
        <NextImage
          className={cn('mb-4 duration-700 ease-in-out hover:scale-105')}
          src={data.data.image}
          alt={data.data.title}
          loading="lazy"
          width={800}
          height={400}
          unoptimized
        />
      )}
      <div className="mt-8 space-y-6 leading-[1.8] dark:text-neutral-300">
        <MDXComponent>{data?.data.content}</MDXComponent>
      </div>
    </div>
  );
}
