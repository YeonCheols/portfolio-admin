/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  children: string;
}

interface TableProps {
  children: ReactNode;
}

const Table = ({ children }: TableProps) => (
  <div className="table-container">
    <table className="table w-full">{children}</table>
  </div>
);

// TODO: 모듈화가 필요한 컴포넌트
const MDXComponent = ({ children }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: (props: any) => (
          <a className="cursor-pointer text-teal-500 hover:text-teal-400 hover:underline" {...props} />
        ),
        p: (props: any) => <div {...props} />,
        h2: (props: any) => <h2 className="text-xl font-medium dark:text-neutral-300" {...props} />,
        h3: (props: any) => (
          <h3 className="pt-4 text-[18px] font-medium leading-snug dark:text-neutral-300" {...props} />
        ),
        ul: ({ ordered, ...props }: any) => {
          return <ul className="list-disc space-y-3 pb-2 pl-10" {...props} />;
        },
        ol: ({ ordered, ...props }: any) => <ol className="list-decimal space-y-3 pb-2 pl-10" {...props} />,
        code: (props: any) => <CodeBlock {...props} />,
        blockquote: (props: any) => (
          <blockquote
            className="rounded-br-2xl border-l-[5px] border-neutral-700 border-l-cyan-500 bg-neutral-200 py-3 pl-6  text-lg font-medium text-cyan-800 dark:bg-neutral-800 dark:text-cyan-200"
            {...props}
          />
        ),
        table: (props: any) => <Table {...props} />,
        th: (props: any) => <th className="border px-3 py-1 text-left dark:border-neutral-600">{props.children}</th>,
        td: (props: any) => <td className="border px-3  py-1 dark:border-neutral-600">{props.children}</td>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MDXComponent;
