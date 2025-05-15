export type TableHeader = {
  id: number;
  name: string;
};

export type Table<T> = {
  header: TableHeader[];
  body: T[];
};
