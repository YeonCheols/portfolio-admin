'use client';

import { getIconComponent } from '@yeoncheols/portfolio-core-ui';
import { ProjectPreview as ProjectPreviewComponent } from '@yeoncheols/portfolio-core-ui';
import { useParams } from 'next/navigation';
import { type JSX, useEffect } from 'react';
import React from 'react';
import useSWR from 'swr';
import { TopNav } from '@/components/nav';
import { Loading } from '@/components/ui';
import { type TagResponse, type TagSearchResponse, type ProjectResponse } from '@/docs/api';
import { usePropsContext } from '@/lib/context/props';
import { fetcher } from '@/lib/fetcher';

export default function ProjectPreview() {
  const { setContextProps } = usePropsContext();
  const params = useParams();

  const { data } = useSWR<{ data: ProjectResponse }>(`/api/project/slug?slug=${params.slug}`, fetcher);

  const { data: stacksData } = useSWR<TagSearchResponse>('/api/stacks', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const StackIcons: Record<string, JSX.Element> =
    stacksData?.data.reduce((acc: Record<string, JSX.Element>, item: TagResponse) => {
      const IconComponent = getIconComponent(item.icon);
      if (!IconComponent) {
        return acc;
      }
      acc[item.name] = React.createElement(IconComponent, {
        size: 20,
        className: `${item.color}`,
        title: item.name,
      });
      return acc;
    }, {}) ?? {};

  useEffect(() => {
    setContextProps({ header: <TopNav title="프로젝트 미리보기" /> });
  }, []);

  if (!data || !stacksData) {
    return <Loading />;
  }

  return (
    <div className="mt-10 space-y-8">
      <ProjectPreviewComponent data={data.data} stackIcons={StackIcons} />
    </div>
  );
}
