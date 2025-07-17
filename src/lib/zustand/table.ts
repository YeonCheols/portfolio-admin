import { create } from 'zustand';
import type { Checkbox, TableData, Table as TableType } from '@/types/table';
import type { Pagination } from '@/types/table';

interface TableStore {
  table: TableType<TableData>;
  checkbox: Checkbox[];
  setTable: (table: TableType<TableData>) => void;
  setBody: (body: TableData[]) => void;
  addRow: (row: TableData) => void;
  updateRow: (rowIndex: number, updated: Partial<TableData>) => void;
  deleteRow: (rowIndex: number, checked: boolean) => void;
  selectCheckbox: (data: Checkbox) => void;
  allSelectCheckbox: (checkboxList: Checkbox[]) => void;
}

export const useTableStore = create<TableStore>(set => ({
  table: { header: [], body: [], draggableOption: { draggable: false }, pagination: null },
  checkbox: [],
  setTable: table => set({ table }),
  setBody: body => set(state => ({ table: { ...state.table, body } })),
  setCheckbox: (checkbox: Checkbox[]) => set({ checkbox: { ...checkbox } }),
  addRow: row =>
    set(state => ({
      table: {
        ...state.table,
        body: [...state.table.body, row as TableData],
      },
    })),
  updateRow: (rowIndex, updated) =>
    set(state => ({
      table: {
        ...state.table,
        body: state.table.body.map((row, idx) => (idx === rowIndex ? ({ ...row, ...updated } as TableData) : row)),
      },
    })),
  deleteRow: rowIndex =>
    set(state => ({
      table: {
        ...state.table,
        body: state.table.body.filter((_, idx) => idx !== rowIndex),
      },
    })),
  selectCheckbox: data =>
    set(state => ({
      checkbox: state.checkbox.find(checkbox => checkbox.id === data.id)
        ? state.checkbox.filter(checkbox => checkbox.id !== data.id)
        : [...state.checkbox, data],
    })),
  allSelectCheckbox: checkboxList =>
    set(_ => ({
      checkbox: checkboxList,
    })),
}));
