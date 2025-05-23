'use client';

import Link from 'next/link';
import { useMemo, isValidElement, type ReactElement } from 'react';
import { Loading } from './loading';
import type { Table, TableOptions } from '@/types/table';

type TableData = Record<string, string | number | boolean | ReactElement | TableOptions>;

function Table({ table, isLoading = false }: { table: Table<TableData>; isLoading: boolean }) {
  const header = useMemo(() => {
    return (
      table.header && (
        <tr>
          {table.header.map(item => {
            return (
              <th key={item.id} scope="col" className="px-6 py-4">
                {item.name}
              </th>
            );
          })}
        </tr>
      )
    );
  }, [table]);

  const renderType = (options: TableOptions) => {
    if (options?.link && options.link.href) {
      const { href, title, ...linkProps } = options.link;

      if (!href.startsWith('http')) {
        return (
          <Link {...linkProps} href={href} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
            {title}
          </Link>
        );
      }
      // 외부 url
      return (
        <a {...linkProps} href={href} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
          {title}
        </a>
      );
    }
    if (options?.status) {
      const { status, title } = options.status;
      return (
        <div className="flex items-center">
          {status ? (
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
          ) : (
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
          )}
          {title}
        </div>
      );
    }
  };

  const renderItem = (data: TableData) => {
    return Object.entries(data).map(([key, value]) => {
      if (isValidElement(value)) {
        return (
          <td key={key} className="px-6 py-4">
            {value}
          </td>
        );
      }
      if (typeof value === 'object') {
        return (
          <td key={key} className="px-6 py-4">
            {renderType(value)}
          </td>
        );
      }

      return (
        <td key={key} className="px-6 py-4">
          {value}
        </td>
      );
    });
  };

  const body = useMemo(() => {
    return (
      table.body && (
        <>
          {table.body.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {renderItem(item)}
            </tr>
          ))}
        </>
      )
    );
  }, [table]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {header}
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}

export { Table };
