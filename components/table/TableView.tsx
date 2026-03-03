"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Settings2,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import BulkActionBar from "@/components/table/BulkActionBar";
import ImportExportBar from "@/components/table/ImportExportBar";
import RowActions from "@/components/table/RowActions";
import TableSettings from "@/components/table/TableSettings";
import type {
  CellValue,
  ColumnType,
  SortState,
  TableColumn,
  TableDensity,
  TableRow,
} from "@/components/table/types";

interface TableViewProps {
  data: TableRow[];
  initialColumns: TableColumn[];
}

interface EditingCell {
  rowId: string;
  columnId: string;
}

const densityRowHeight: Record<TableDensity, string> = {
  compact: "h-12",
  comfortable: "h-14",
  spacious: "h-16",
};

const densityInputHeight: Record<TableDensity, string> = {
  compact: "h-9",
  comfortable: "h-10",
  spacious: "h-11",
};

const DEFAULT_COLUMN_WIDTH = 220;
const MIN_COLUMN_WIDTH = 90;
const MAX_COLUMN_WIDTH = 560;
const MAX_VISIBLE_LOGOS = 4;
const LOGO_SIZE = 32;
const ADD_LOGO_BUTTON_SIZE = 40;
const LOGO_OVERLAP = 8;

function generateRowId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `row-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizeId(value: string): string {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "column";
}

function defaultValueByType(type: ColumnType): CellValue {
  if (type === "number") {
    return 0;
  }
  if (type === "boolean") {
    return false;
  }
  return "";
}

function compareCellValues(
  left: CellValue,
  right: CellValue,
  type: ColumnType,
): number {
  if (left === right) {
    return 0;
  }
  if (left === null) {
    return 1;
  }
  if (right === null) {
    return -1;
  }

  if (type === "number") {
    return Number(left) - Number(right);
  }

  if (type === "boolean") {
    return Number(Boolean(left)) - Number(Boolean(right));
  }

  return String(left).localeCompare(String(right), undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

function formatCellValue(value: CellValue): string {
  if (value === null || value === "") {
    return "-";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}

function escapeCsvCell(value: CellValue): string {
  const normalized = value === null ? "" : String(value);
  const escaped = normalized.replace(/"/g, '""');
  return `"${escaped}"`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

function ConfirmationDialog({
  open,
  title,
  description,
  actionLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  actionLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4"
          onClick={onCancel}
        >
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-md rounded-2xl border border-black/10 bg-[#fdfcf7] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2 text-red-700">
              <TriangleAlert size={18} aria-hidden="true" />
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            </div>
            <p className="mb-5 text-sm leading-6 text-neutral-700">{description}</p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                {actionLabel}
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function TableView({ data, initialColumns }: TableViewProps) {
  const [tableTitle, setTableTitle] = useState("My table");
  const [columns, setColumns] = useState<TableColumn[]>(initialColumns);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const column of initialColumns) {
      initial[column.id] = DEFAULT_COLUMN_WIDTH;
    }
    return initial;
  });
  const [rows, setRows] = useState<TableRow[]>(data);
  const [sort, setSort] = useState<SortState>({ columnId: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [density, setDensity] = useState<TableDensity>("comfortable");
  const [showGridLines, setShowGridLines] = useState(true);
  const [showColumnSeparators, setShowColumnSeparators] = useState(false);
  const [stripedRows, setStripedRows] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editingDraft, setEditingDraft] = useState("");
  const [pendingDeleteRowId, setPendingDeleteRowId] = useState<string | null>(null);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);
  const [rowLogosById, setRowLogosById] = useState<Record<string, string[]>>({});
  const selectAllRef = useRef<HTMLInputElement>(null);

  const selectedSet = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);

  const visibleColumns = useMemo(
    () => columns.filter((column) => column.visible),
    [columns],
  );
  const logosColumnWidth = useMemo(() => {
    const maxLogosCount = Math.max(
      0,
      ...Object.values(rowLogosById).map((logos) => logos.length),
    );
    const visibleLogosCount = Math.min(MAX_VISIBLE_LOGOS, maxLogosCount);
    const logosStackWidth =
      visibleLogosCount === 0
        ? 0
        : LOGO_SIZE + (visibleLogosCount - 1) * (LOGO_SIZE - LOGO_OVERLAP);
    const contentWidth =
      logosStackWidth +
      (visibleLogosCount > 0
        ? ADD_LOGO_BUTTON_SIZE - LOGO_OVERLAP
        : ADD_LOGO_BUTTON_SIZE);

    return Math.max(96, Math.min(220, contentWidth + 24));
  }, [rowLogosById]);

  const sortedRows = useMemo(() => {
    if (!sort.columnId) {
      return rows;
    }

    const activeColumn = columns.find((column) => column.id === sort.columnId);
    if (!activeColumn) {
      return rows;
    }

    const sorted = [...rows].sort((leftRow, rightRow) => {
      const leftValue = leftRow[activeColumn.id] ?? null;
      const rightValue = rightRow[activeColumn.id] ?? null;
      const result = compareCellValues(leftValue, rightValue, activeColumn.type);

      if (result === 0) {
        return leftRow.id.localeCompare(rightRow.id);
      }
      return sort.direction === "asc" ? result : -result;
    });

    return sorted;
  }, [rows, columns, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageRows = sortedRows.slice(startIndex, endIndex);
  const allRowsSelected = rows.length > 0 && selectedRowIds.length === rows.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRowIds.length > 0 && !allRowsSelected;
    }
  }, [selectedRowIds, allRowsSelected]);

  const handleSort = (columnId: string) => {
    setSort((current) => {
      if (current.columnId !== columnId) {
        return { columnId, direction: "asc" };
      }
      return {
        columnId,
        direction: current.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  const handleToggleRowSelection = (rowId: string) => {
    setSelectedRowIds((current) =>
      current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...current, rowId],
    );
  };

  const handleToggleAllRows = () => {
    setSelectedRowIds((current) => {
      if (rows.length === 0) {
        return [];
      }
      return current.length === rows.length ? [] : rows.map((row) => row.id);
    });
  };

  const updateCell = (rowId: string, columnId: string, value: CellValue) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== rowId) {
          return row;
        }
        return {
          ...row,
          [columnId]: value,
        };
      }),
    );
  };

  const beginEditCell = (
    rowId: string,
    columnId: string,
    currentValue: CellValue,
    type: ColumnType,
  ) => {
    if (type === "boolean") {
      return;
    }
    setEditingCell({ rowId, columnId });
    setEditingDraft(currentValue === null ? "" : String(currentValue));
  };

  const cancelEditCell = () => {
    setEditingCell(null);
    setEditingDraft("");
  };

  const commitEditCell = () => {
    if (!editingCell) {
      return;
    }

    const column = columns.find((item) => item.id === editingCell.columnId);
    if (!column) {
      cancelEditCell();
      return;
    }

    const raw = editingDraft.trim();
    let nextValue: CellValue = raw;

    if (column.type === "number") {
      if (raw === "") {
        nextValue = null;
      } else {
        const parsed = Number(raw);
        if (Number.isNaN(parsed)) {
          cancelEditCell();
          return;
        }
        nextValue = parsed;
      }
    }

    if (column.type === "text") {
      nextValue = raw;
    }

    updateCell(editingCell.rowId, editingCell.columnId, nextValue);
    cancelEditCell();
  };

  const handleDuplicateRow = (rowId: string) => {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === rowId);
      if (index === -1) {
        return current;
      }

      const source = current[index];
      const duplicate: TableRow = {
        ...source,
        id: generateRowId(),
      };

      const firstTextColumn = columns.find((column) => column.type === "text");
      if (firstTextColumn) {
        const existingValue = duplicate[firstTextColumn.id];
        if (typeof existingValue === "string" && existingValue.trim() !== "") {
          duplicate[firstTextColumn.id] = `${existingValue} (copy)`;
        } else {
          duplicate[firstTextColumn.id] = "Copied row";
        }
      }

      const nextRows = [...current];
      nextRows.splice(index + 1, 0, duplicate);
      return nextRows;
    });
  };

  const handleDeleteRow = () => {
    if (!pendingDeleteRowId) {
      return;
    }

    setRows((current) => current.filter((row) => row.id !== pendingDeleteRowId));
    setSelectedRowIds((current) =>
      current.filter((rowId) => rowId !== pendingDeleteRowId),
    );
    setPendingDeleteRowId(null);
  };

  const handleDeleteSelectedRows = () => {
    if (selectedRowIds.length === 0) {
      return;
    }

    const idsToDelete = new Set(selectedRowIds);
    setRows((current) => current.filter((row) => !idsToDelete.has(row.id)));
    setSelectedRowIds([]);
    setPendingBulkDelete(false);
  };

  const handleExportSelectedRows = () => {
    if (selectedRowIds.length === 0 || visibleColumns.length === 0) {
      return;
    }

    const rowsToExport = rows.filter((row) => selectedSet.has(row.id));
    const headerRow = visibleColumns
      .map((column) => escapeCsvCell(column.label))
      .join(",");

    const dataRows = rowsToExport.map((row) =>
      visibleColumns.map((column) => escapeCsvCell(row[column.id] ?? null)).join(","),
    );

    const csv = [headerRow, ...dataRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `table-export-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleAddColumn = (payload: { label: string; type: ColumnType }) => {
    const baseId = normalizeId(payload.label);
    let nextId = baseId;
    let suffix = 2;

    while (columns.some((column) => column.id === nextId)) {
      nextId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    const nextColumn: TableColumn = {
      id: nextId,
      label: payload.label,
      type: payload.type,
      visible: true,
      sortable: true,
    };

    setColumns((current) => [...current, nextColumn]);
    setColumnWidths((current) => ({
      ...current,
      [nextId]: DEFAULT_COLUMN_WIDTH,
    }));
    setRows((current) =>
      current.map((row) => ({
        ...row,
        [nextId]: defaultValueByType(payload.type),
      })),
    );
  };

  const handleRenameColumn = (columnId: string, label: string) => {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? {
              ...column,
              label,
            }
          : column,
      ),
    );
  };

  const handleToggleColumnVisibility = (columnId: string) => {
    setColumns((current) => {
      const visibleCount = current.filter((column) => column.visible).length;

      return current.map((column) => {
        if (column.id !== columnId) {
          return column;
        }
        if (column.visible && visibleCount === 1) {
          return column;
        }
        return {
          ...column,
          visible: !column.visible,
        };
      });
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns((current) => {
      if (current.length === 1) {
        return current;
      }

      const nextColumns = current.filter((column) => column.id !== columnId);
      if (nextColumns.length > 0 && nextColumns.every((column) => !column.visible)) {
        nextColumns[0] = {
          ...nextColumns[0],
          visible: true,
        };
      }
      return nextColumns;
    });

    setRows((current) =>
      current.map((row) => {
        const next = { ...row };
        delete next[columnId];
        return next;
      }),
    );
    setColumnWidths((current) => {
      const next = { ...current };
      delete next[columnId];
      return next;
    });

    setSort((current) => {
      if (current.columnId === columnId) {
        return { columnId: null, direction: "asc" };
      }
      return current;
    });
  };

  const handleMoveColumn = (columnId: string, direction: "up" | "down") => {
    setColumns((current) => {
      const index = current.findIndex((column) => column.id === columnId);
      if (index === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [column] = next.splice(index, 1);
      next.splice(targetIndex, 0, column);
      return next;
    });
  };

  const handleImportReplace = (nextColumns: TableColumn[], nextRows: TableRow[]) => {
    setColumns(nextColumns);
    setColumnWidths((current) => {
      const next: Record<string, number> = {};
      for (const column of nextColumns) {
        next[column.id] = current[column.id] ?? DEFAULT_COLUMN_WIDTH;
      }
      return next;
    });
    setRows(nextRows);
    setSort({ columnId: null, direction: "asc" });
    setSelectedRowIds([]);
    setCurrentPage(1);
    setEditingCell(null);
    setEditingDraft("");
    setPendingDeleteRowId(null);
    setPendingBulkDelete(false);
    setRowLogosById((current) => {
      const next: Record<string, string[]> = {};
      for (const row of nextRows) {
        if (current[row.id]) {
          next[row.id] = current[row.id];
        }
      }
      return next;
    });
  };

  const handleStartColumnResize = (
    columnId: string,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth = columnWidths[columnId] ?? DEFAULT_COLUMN_WIDTH;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const nextWidth = Math.max(
        MIN_COLUMN_WIDTH,
        Math.min(MAX_COLUMN_WIDTH, startWidth + deltaX),
      );
      setColumnWidths((current) => ({
        ...current,
        [columnId]: nextWidth,
      }));
    };

    const handleMouseUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleRowLogosUpload = async (
    rowId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length === 0) {
      return;
    }

    try {
      const logos = await Promise.all(files.map(fileToDataUrl));
      setRowLogosById((current) => ({
        ...current,
        [rowId]: [...(current[rowId] ?? []), ...logos],
      }));
    } finally {
      input.value = "";
    }
  };

  const handleRemoveRowLogo = (rowId: string, logoIndex: number) => {
    setRowLogosById((current) => {
      const rowLogos = current[rowId] ?? [];
      if (!rowLogos[logoIndex]) {
        return current;
      }

      const nextRowLogos = rowLogos.filter((_, index) => index !== logoIndex);
      if (nextRowLogos.length === 0) {
        const next = { ...current };
        delete next[rowId];
        return next;
      }

      return {
        ...current,
        [rowId]: nextRowLogos,
      };
    });
  };

  const handleDownloadTemplate = () => {
    const templateColumns: TableColumn[] = [
      {
        id: "name",
        label: "Name",
        type: "text",
        visible: true,
        sortable: true,
      },
      {
        id: "active",
        label: "Active",
        type: "boolean",
        visible: true,
        sortable: true,
      },
    ];

    const templateRows: TableRow[] = [
      { id: "row-1", name: "Example A", active: true },
      { id: "row-2", name: "Example B", active: false },
    ];

    const json = JSON.stringify(
      { columns: templateColumns, rows: templateRows },
      null,
      2,
    );
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "table-template.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const pendingDeleteRow = pendingDeleteRowId
    ? rows.find((row) => row.id === pendingDeleteRowId) ?? null
    : null;

  return (
    <>
      <BulkActionBar
        selectedCount={selectedRowIds.length}
        totalCount={rows.length}
        allSelected={allRowsSelected}
        onToggleSelectAll={handleToggleAllRows}
        onDeleteSelected={() => setPendingBulkDelete(true)}
        onExportSelected={handleExportSelectedRows}
        onClearSelection={() => setSelectedRowIds([])}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-neutral-900">{tableTitle}</h2>
        <div className="flex flex-wrap items-start justify-end gap-2">
          <ImportExportBar
            columns={columns}
            rows={rows}
            onImport={handleImportReplace}
            showTemplateLink={false}
          />
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
          >
            <Download size={14} aria-hidden="true" />
            Download template
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
          >
            <Settings2 size={14} aria-hidden="true" />
            Settings
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-sm" role="grid">
          <thead className="bg-neutral-200/90">
            <tr className={`h-12 ${showGridLines ? "border-b border-black/10" : ""}`}>
              <th
                scope="col"
                style={{
                  width: `${logosColumnWidth}px`,
                  minWidth: `${logosColumnWidth}px`,
                  maxWidth: `${logosColumnWidth}px`,
                }}
                className={`px-3 py-2 text-left text-base font-semibold uppercase text-neutral-800 ${
                  showColumnSeparators ? "border-r border-black/10" : ""
                }`}
              >
                Logos
              </th>
              {visibleColumns.map((column) => {
                const columnWidth =
                  columnWidths[column.id] ?? DEFAULT_COLUMN_WIDTH;
                const ariaSortValue =
                  sort.columnId === column.id
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none";

                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={ariaSortValue}
                    style={{
                      width: `${columnWidth}px`,
                      minWidth: `${columnWidth}px`,
                      maxWidth: `${columnWidth}px`,
                    }}
                    className={`px-3 py-2 text-left text-base font-semibold uppercase text-neutral-800 ${
                      showColumnSeparators ? "border-r border-black/10" : ""
                    }`}
                  >
                    <div className="relative w-full pr-2">
                      <div className="flex min-w-0 items-center gap-2">
                        {column.sortable ? (
                          <button
                            type="button"
                            onClick={() => handleSort(column.id)}
                            className="inline-flex min-w-0 flex-1 items-center gap-2 text-left transition hover:text-neutral-900"
                          >
                            <span className="block min-w-0 truncate">
                              {column.label}
                            </span>
                            {sort.columnId === column.id ? (
                              sort.direction === "asc" ? (
                                <ArrowUp size={13} aria-hidden="true" />
                              ) : (
                                <ArrowDown size={13} aria-hidden="true" />
                              )
                            ) : (
                              <ArrowUpDown size={13} aria-hidden="true" />
                            )}
                          </button>
                        ) : (
                          <span className="block min-w-0 flex-1 truncate">
                            {column.label}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        aria-label={`Resize ${column.label} column`}
                        onMouseDown={(event) =>
                          handleStartColumnResize(column.id, event)
                        }
                        className="absolute right-0 top-1/2 z-10 h-full w-3 -translate-y-1/2 translate-x-1/2 cursor-col-resize"
                      >
                        <span
                          aria-hidden="true"
                          className="mx-auto block h-6 w-px rounded-full bg-transparent transition hover:bg-neutral-500"
                        />
                      </button>
                    </div>
                  </th>
                );
              })}
              <th
                scope="col"
                className={`w-16 px-3 py-2 text-right text-base font-semibold uppercase text-neutral-800 ${
                  showColumnSeparators ? "border-r border-black/10" : ""
                }`}
              >
                Actions
              </th>
              <th scope="col" className="w-12 px-3 py-2 text-right">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allRowsSelected}
                  onChange={handleToggleAllRows}
                  aria-label="Select all rows"
                  className="h-4 w-4 rounded border-black/20 text-sky-600 focus:ring-sky-500"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + 3}
                  className="px-4 py-8 text-center text-sm text-neutral-500"
                >
                  No rows available.
                </td>
              </tr>
            ) : (
              pageRows.map((row, rowIndex) => {
                const absoluteIndex = startIndex + rowIndex;
                const stripedClass =
                  stripedRows && absoluteIndex % 2 === 1 ? "bg-neutral-100/95" : "";
                const gridClass = showGridLines ? "border-b border-black/10" : "";
                const rowHeightClass = densityRowHeight[density];

                return (
                  <tr
                    key={row.id}
                    className={`${rowHeightClass} ${stripedClass} ${gridClass}`}
                  >
                    <td
                      style={{
                        width: `${logosColumnWidth}px`,
                        minWidth: `${logosColumnWidth}px`,
                        maxWidth: `${logosColumnWidth}px`,
                      }}
                      className={`h-full px-3 align-middle ${
                        showColumnSeparators ? "border-r border-black/10" : ""
                      }`}
                    >
                      <div className="flex items-center justify-start">
                        <div className="flex items-center -space-x-2">
                          {rowLogosById[row.id]
                            ?.slice(-MAX_VISIBLE_LOGOS)
                            .map((logo, logoIndex, visibleLogos) => {
                              const rowLogos = rowLogosById[row.id] ?? [];
                              const baseIndex = rowLogos.length - visibleLogos.length;
                              const actualLogoIndex = baseIndex + logoIndex;

                              return (
                                <div
                                  key={`${row.id}-logo-${actualLogoIndex}`}
                                  className="group relative h-8 w-8 min-h-8 min-w-8 shrink-0"
                                >
                                  <Image
                                    src={logo}
                                    alt={`Logo ${actualLogoIndex + 1} for row ${absoluteIndex + 1}`}
                                    width={32}
                                    height={32}
                                    unoptimized
                                    className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveRowLogo(row.id, actualLogoIndex)
                                    }
                                    aria-label={`Remove logo ${actualLogoIndex + 1} from row ${absoluteIndex + 1}`}
                                    className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-black/10 bg-white text-[10px] text-neutral-700 opacity-0 shadow-sm transition hover:bg-red-50 hover:text-red-700 group-hover:opacity-100 focus:opacity-100"
                                  >
                                    <X size={10} aria-hidden="true" />
                                  </button>
                                </div>
                              );
                            })}

                          <label
                            htmlFor={`logo-upload-${row.id}`}
                            className="z-10 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-400 border-2 border-white object-cover shadow-sm bg-neutral-100 transition hover:text-neutral-800"
                            aria-label={`Add logos for row ${absoluteIndex + 1}`}
                          >
                            <Plus size={16} aria-hidden="true" />
                          </label>
                        </div>
                        <input
                          id={`logo-upload-${row.id}`}
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={(event) => handleRowLogosUpload(row.id, event)}
                        />
                      </div>
                    </td>

                    {visibleColumns.map((column) => {
                      const columnWidth =
                        columnWidths[column.id] ?? DEFAULT_COLUMN_WIDTH;
                      const cellKey = `${row.id}-${column.id}`;
                      const value = row[column.id] ?? null;
                      const isEditing =
                        editingCell?.rowId === row.id &&
                        editingCell.columnId === column.id;

                      return (
                        <td
                          key={cellKey}
                          style={{
                            width: `${columnWidth}px`,
                            minWidth: `${columnWidth}px`,
                            maxWidth: `${columnWidth}px`,
                          }}
                          className={`h-full px-3 align-middle text-neutral-700 ${
                            showColumnSeparators ? "border-r border-black/10" : ""
                          }`}
                        >
                          {column.type === "boolean" ? (
                            <button
                              type="button"
                              onClick={() =>
                                updateCell(row.id, column.id, !Boolean(value))
                              }
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                                Boolean(value)
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                  : "border-neutral-300 bg-white text-neutral-600 hover:text-neutral-900"
                              }`}
                              aria-label={`Toggle ${column.label} for row ${absoluteIndex + 1}`}
                            >
                              {Boolean(value) ? "True" : "False"}
                            </button>
                          ) : isEditing ? (
                            <input
                              autoFocus
                              value={editingDraft}
                              onChange={(event) =>
                                setEditingDraft(event.currentTarget.value)
                              }
                              onBlur={commitEditCell}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  commitEditCell();
                                }
                                if (event.key === "Escape") {
                                  event.preventDefault();
                                  cancelEditCell();
                                }
                              }}
                              aria-label={`Edit ${column.label} for row ${absoluteIndex + 1}`}
                              className={`w-full rounded-md border border-sky-300 bg-white px-2 py-1 text-sm text-neutral-900 outline-none ring-2 ring-sky-200 ${densityInputHeight[density]}`}
                            />
                          ) : (
                            <div
                              tabIndex={0}
                              role="button"
                              onDoubleClick={() =>
                                beginEditCell(row.id, column.id, value, column.type)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  beginEditCell(
                                    row.id,
                                    column.id,
                                    value,
                                    column.type,
                                  );
                                }
                              }}
                              aria-label={`Cell ${column.label}, row ${
                                absoluteIndex + 1
                              }. Press Enter to edit.`}
                              className="flex h-full w-full items-center rounded px-2 py-1 outline-none transition focus:bg-sky-50 focus:ring-2 focus:ring-sky-200"
                              title={formatCellValue(value)}
                            >
                              <span className="block w-full truncate">
                                {formatCellValue(value)}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td
                      className={`h-full px-3 text-right align-middle ${
                        showColumnSeparators ? "border-r border-black/10" : ""
                      }`}
                    >
                      <RowActions
                        rowLabel={`row ${absoluteIndex + 1}`}
                        onDuplicate={() => handleDuplicateRow(row.id)}
                        onDelete={() => setPendingDeleteRowId(row.id)}
                      />
                    </td>

                    <td className="h-full px-3 text-right align-middle">
                      <input
                        type="checkbox"
                        checked={selectedSet.has(row.id)}
                        onChange={() => handleToggleRowSelection(row.id)}
                        aria-label={`Select row ${absoluteIndex + 1}`}
                        className="h-4 w-4 rounded border-black/20 text-sky-600 focus:ring-sky-500"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-600">
          Showing{" "}
          <span className="font-semibold text-neutral-900">
            {rows.length === 0 ? 0 : startIndex + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-neutral-900">
            {Math.min(endIndex, sortedRows.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-neutral-900">{sortedRows.length}</span>{" "}
          rows
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={activePage <= 1}
            onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
            className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={14} aria-hidden="true" />
            Prev
          </button>

          <span className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700">
            Page <span className="font-semibold text-neutral-900">{activePage}</span>{" "}
            / <span className="font-semibold text-neutral-900">{totalPages}</span>
          </span>

          <button
            type="button"
            disabled={activePage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
            className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <TableSettings
        open={settingsOpen}
        density={density}
        rowsPerPage={rowsPerPage}
        showGridLines={showGridLines}
        showColumnSeparators={showColumnSeparators}
        stripedRows={stripedRows}
        columns={columns}
        onClose={() => setSettingsOpen(false)}
        onDensityChange={setDensity}
        onRowsPerPageChange={handleRowsPerPageChange}
        onToggleGridLines={() => setShowGridLines((current) => !current)}
        onToggleColumnSeparators={() =>
          setShowColumnSeparators((current) => !current)
        }
        onToggleStripedRows={() => setStripedRows((current) => !current)}
        onToggleColumnVisibility={handleToggleColumnVisibility}
        tableTitle={tableTitle}
        onTableTitleChange={setTableTitle}
        onAddColumn={handleAddColumn}
        onRenameColumn={handleRenameColumn}
        onDeleteColumn={handleDeleteColumn}
        onMoveColumn={handleMoveColumn}
      />

      <ConfirmationDialog
        open={pendingDeleteRow !== null}
        title="Delete row"
        description="This action cannot be undone. The selected row will be permanently removed from the table."
        actionLabel="Delete row"
        onCancel={() => setPendingDeleteRowId(null)}
        onConfirm={handleDeleteRow}
      />

      <ConfirmationDialog
        open={pendingBulkDelete}
        title="Delete selected rows"
        description={`You are about to delete ${selectedRowIds.length} selected row${
          selectedRowIds.length > 1 ? "s" : ""
        }.`}
        actionLabel="Delete selected"
        onCancel={() => setPendingBulkDelete(false)}
        onConfirm={handleDeleteSelectedRows}
      />
    </>
  );
}
