'use client';

import { StackIcon } from '@yeoncheols/portfolio-core-ui';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { TopNav } from '@/components/nav';
import { Loading, MDXComponent } from '@/components/ui';
import StacksLink from '@/components/ui/project/link';
import Tooltip from '@/components/ui/tooltip';
import { type AdminTagResponse, type ProjectResponse } from '@/docs/api';
import { getData } from '@/lib/api';
import { usePropsContext } from '@/lib/context/props';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

// TODO: 프로젝트 미리보기 모듈화
export default function ProjectPreview() {
  const { setContextProps } = usePropsContext();
  const params = useParams();
  const [stacksMetadata, setStacksMetadata] = useState<Array<{ name: string; icon: string; color: string }>>([]);

  const { data } = useSWR<{ data: ProjectResponse }>(`/api/project/slug?slug=${params.slug}`, fetcher);

  // 스택 메타데이터 로드
  useEffect(() => {
    const loadStacksMetadata = async () => {
      try {
        const response = await getData<{ data: AdminTagResponse[] }>('/api/stacks');
        if (response.status) {
          setStacksMetadata(response.data.data);
        }
      } catch {
        console.error('Failed to load stacks metadata');
      }
    };

    loadStacksMetadata();
  }, []);

  useEffect(() => {
    setContextProps({ header: <TopNav title="프로젝트 미리보기" /> });
  }, []);

  if (!data) {
    return <Loading />;
  }

  const stacksArray = JSON.parse(data.data.stacks);

  // 스택 이름으로 메타데이터 찾기
  const getStackMetadata = (stackName: string) => {
    return stacksMetadata.find(stack => stack.name === stackName) || { name: stackName, icon: '', color: '' };
  };

  return (
    <div className="mt-10 space-y-8">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mb-1 text-[15px] text-neutral-700 dark:text-neutral-300">Tech Stack :</span>
          <div className="flex flex-wrap items-center gap-3">
            {stacksArray?.map((stack: string, index: number) => {
              const metadata = getStackMetadata(stack);
              return (
                <div key={index}>
                  <Tooltip title={stack}>
                    <StackIcon name={metadata.name} icon={metadata.icon} color={metadata.color} size={20} />
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
        <StacksLink title={data.data.title} linkDemo={data.data.linkDemo} linkGithub={data.data.linkGithub} />
      </div>
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
