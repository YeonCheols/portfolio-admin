import { type ReactElement, type AnchorHTMLAttributes } from 'react';

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

export type Table<T> = {
  header: TableHeader[];
  body: T[];
};
