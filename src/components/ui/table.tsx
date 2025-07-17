'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import { useMemo, isValidElement, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactPaginate from 'react-paginate';
import { useTableStore } from '@/lib/zustand/table';
import type { Table, TableData, TableHeader, TableOptions, TableProps } from '@/types/table';

function Table({ table, isLoading = false }: TableProps & { onPageChange?: (page: number) => void }) {
  const { table: tableStore, checkbox, setTable, selectCheckbox, allSelectCheckbox } = useTableStore();

  const header = useMemo(() => {
    const renderHeaderItem = (item: TableHeader) => {
      if (item.type === 'checkbox') {
        return (
          <th key={item.id} scope="col" className="px-6 py-3">
            <input
              type="checkbox"
              className="w-4 h-4"
              onChange={e => {
                const checkboxList = tableStore.body.flatMap(row =>
                  Object.values(row)
                    .filter(value => (value as TableOptions).checkbox?.id && (value as TableOptions).checkbox?.value)
                    .map(value => {
                      const { id, value: val } = (value as TableOptions).checkbox!;
                      return { id, value: val, checked: true };
                    }),
                );

                allSelectCheckbox(e.currentTarget.checked ? checkboxList : []);
              }}
            />
          </th>
        );
      }
      return (
        <th key={item.id} scope="col" className="px-6 py-3">
          {item.name}
        </th>
      );
    };
    return (
      tableStore.header && (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {tableStore.header.map(item => {
              return renderHeaderItem(item);
            })}
          </tr>
        </thead>
      )
    );
  }, [tableStore]);

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
    if (options?.checkbox) {
      const { id, value } = options.checkbox;
      const isChecked = checkbox.find(checkbox => checkbox.id === id)?.checked;

      return (
        <input
          type="checkbox"
          key={id}
          value={value}
          checked={isChecked || false}
          onChange={e => {
            selectCheckbox({ id, value, checked: e.currentTarget.checked });
          }}
          className="w-4 h-4"
        />
      );
    }
  };

  const renderItem = (data: TableData) => {
    return Object.entries(data).map(([key, value]) => {
      if (isValidElement(value)) {
        return (
          <td key={key} className="px-6 py-3">
            {value}
          </td>
        );
      }
      if (typeof value === 'object') {
        return (
          <td key={key} className="px-6 py-3">
            {renderType(value)}
          </td>
        );
      }

      return (
        <td key={key} className="px-6 py-3">
          {value}
        </td>
      );
    });
  };

  // body는 table.body만 사용 (slice 등 페이징 연산 제거)
  const body = useMemo(() => {
    return (
      <DragDropContext onDragEnd={e => table.draggableOption?.onDrop?.(e)}>
        <Droppable
          droppableId="table-body"
          direction="vertical"
          type="table-body"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {provided => (
            <AnimatePresence mode="wait">
              <motion.tbody
                key={table.pagination?.page}
                id="root-tbody"
                ref={provided.innerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {isLoading && (!table.body || table.body.length === 0) ? (
                  <tr>
                    <td colSpan={tableStore.header?.length || 1} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span>로딩 중...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.body &&
                  table.body.map((item, index) => (
                    <Draggable
                      key={`row-${index}`}
                      draggableId={`row-${index}`}
                      index={index}
                      isDragDisabled={!table.draggableOption?.draggable}
                    >
                      {provided => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          data-row-index={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          {renderItem(item)}
                        </tr>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </motion.tbody>
            </AnimatePresence>
          )}
        </Droppable>
      </DragDropContext>
    );
  }, [table, checkbox, isLoading, tableStore.header]);

  useEffect(() => {
    setTable(table);
  }, []);

  return (
    <motion.div
      className="relative overflow-x-auto shadow-md sm:rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {header}
        {body}
      </table>
      <div className="flex justify-center my-4">
        {table.pagination && (
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={Math.ceil(table.pagination.allTotal / table.pagination.size)}
            marginPagesDisplayed={table.pagination.page}
            pageRangeDisplayed={table.pagination.size}
            onPageChange={({ selected }) => {
              if (table.pagination) {
                setTable({ ...table, pagination: { ...table.pagination, page: selected + 1 } });
                table.pagination.onPageChange?.(selected + 1);
              }
            }}
            containerClassName={'flex gap-2 pagination'}
            pageClassName={'px-2 py-1 border rounded'}
            activeClassName={'bg-blue-500 text-white'}
            previousClassName={'px-2 py-1 border rounded'}
            nextClassName={'px-2 py-1 border rounded'}
            breakClassName={'px-2 py-1'}
            forcePage={table.pagination.page - 1}
          />
        )}
      </div>
    </motion.div>
  );
}

export { Table };
