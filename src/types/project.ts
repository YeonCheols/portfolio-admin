export type TableHeader = {
  id: number;
  name: string;
};

export type Table = {
  header: TableHeader[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
};
