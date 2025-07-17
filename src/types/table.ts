import { type ReactElement, type AnchorHTMLAttributes } from 'react';
import { type DropResult } from 'react-beautiful-dnd';

export type TableData = Record<string, string | number | boolean | ReactElement | TableOptions>;

export interface Link extends AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
}

export interface Status {
  status: boolean;
  title: string;
}

export interface Checkbox {
  id: string;
  value: string;
  checked: boolean;
}

export interface DraggableOptions {
  draggable: boolean;
  onDrop?: (result: DropResult) => void;
}

export type TableOptions = {
  link?: Link;
  status?: Status;
  checkbox?: Checkbox;
};

export type TableHeader = {
  id: number;
  name?: string;
  type?: 'checkbox';
};

export interface Pagination {
  total: number;
  allTotal: number;
  page: number;
  size: number;
  onPageChange?: (page: number) => void;
}
export interface Table<T> {
  header: TableHeader[];
  body: T[];
  draggableOption?: DraggableOptions;
  pagination?: Pagination | null;
}
export interface TableProps {
  table: Table<TableData>;
  isLoading?: boolean;
}
