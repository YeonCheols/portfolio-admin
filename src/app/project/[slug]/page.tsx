'use client';

import useSWR from 'swr';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetcher } from '@/lib/fetcher';
import { useParams } from 'next/navigation';
import type { Components } from 'react-markdown';
import { Loading } from '@/components/ui/loading';
import Image from 'next/image';

// TODO: 프로젝트 미리보기 모듈화
export default function ProjectPreview() {
  const params = useParams();
  const { data } = useSWR<{ data: { title: String, content: string, image: string } }>(`/api/project/slug?slug=${params.slug}`, fetcher);

  if (!data) {
    return <Loading />;
  }
  

  const components = {
    a: ({ children, ...props }: any) => (
      <a className="cursor-pointer text-teal-500 hover:text-teal-400 hover:underline" {...props}>
        {children}
      </a>
    ),
    p: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl font-medium dark:text-neutral-300" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="pt-4 text-[18px] font-medium leading-snug dark:text-neutral-300" {...props}>
        {children}
      </h3>
    ),
    ul: ({ ordered, children, ...props }: any) => (
      <ul className="list-disc space-y-3 pb-2 pl-10" {...props}>
        {children}
      </ul>
    ),
    ol: ({ ordered, children, ...props }: any) => (
      <ol className="list-decimal space-y-3 pb-2 pl-10" {...props}>
        {children}
      </ol>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        className="rounded-br-2xl border-l-[5px] border-neutral-700 border-l-cyan-500 bg-neutral-200 py-3 pl-6  text-lg font-medium text-cyan-800 dark:bg-neutral-800 dark:text-cyan-200"
        {...props}
      >
        {children}
      </blockquote>
    ),
    th: ({ children, ...props }: any) => (
      <th className="border px-3 py-1 text-left dark:border-neutral-600" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="border px-3 py-1 dark:border-neutral-600" {...props}>
        {children}
      </td>
    ),
  } as Components;

  return (
    <>
    {data.data?.image && data.data.image.startsWith("https") && (
        <Image
          src={data.data.image}
          width={800}
          height={400}
          alt={data.data.title as string}
          className="hover:scale-105 mb-8"
        />
      )}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {data?.data.content}
      </ReactMarkdown>
    </>
  );
}
