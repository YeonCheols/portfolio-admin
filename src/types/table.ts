import { type AnchorHTMLAttributes } from 'react';

export interface Link extends AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
}

export interface Status {
  status: boolean;
  title: string;
}

export type TableOptions = {
  link?: Link;
  status?: Status;
};

export type TableHeader = {
  id: number;
  name: string;
};

export type Table<T> = {
  header: TableHeader[];
  body: T[];
};
