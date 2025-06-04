import { type ReactElement, type AnchorHTMLAttributes, type HTMLAttributes } from 'react';

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

export interface DraggableOptions extends HTMLAttributes<HTMLTableRowElement> {
  draggable: boolean;
  'data-value'?: object | string;
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

export interface Table<T> {
  header: TableHeader[];
  body: T[];
  draggableOption?: DraggableOptions;
}

export interface TableProps {
  table: Table<TableData>;
  isLoading?: boolean;
}
