export type TableDensity = "compact" | "comfortable" | "spacious";
export type ColumnType = "text" | "number" | "boolean";
export type SortDirection = "asc" | "desc";
export type CellValue = string | number | boolean | null;

export interface TableColumn {
  id: string;
  label: string;
  type: ColumnType;
  visible: boolean;
  sortable: boolean;
}

export type TableRow = {
  id: string;
} & Record<string, CellValue>;

export interface SortState {
  columnId: string | null;
  direction: SortDirection;
}
