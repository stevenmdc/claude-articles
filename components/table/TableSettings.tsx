"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Plus, Settings2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  ColumnType,
  TableColumn,
  TableDensity,
} from "@/components/table/types";

interface TableSettingsProps {
  open: boolean;
  density: TableDensity;
  rowsPerPage: number;
  showGridLines: boolean;
  showColumnSeparators: boolean;
  stripedRows: boolean;
  columns: TableColumn[];
  tableTitle: string;
  onClose: () => void;
  onDensityChange: (density: TableDensity) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onToggleGridLines: () => void;
  onToggleColumnSeparators: () => void;
  onToggleStripedRows: () => void;
  onToggleColumnVisibility: (columnId: string) => void;
  onTableTitleChange: (title: string) => void;
  onAddColumn: (payload: { label: string; type: ColumnType }) => void;
  onRenameColumn: (columnId: string, label: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveColumn: (columnId: string, direction: "up" | "down") => void;
}

const densityOptions: Array<{ value: TableDensity; label: string }> = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

const rowsPerPageOptions = [5, 10, 20, 50];

export default function TableSettings({
  open,
  density,
  rowsPerPage,
  showGridLines,
  showColumnSeparators,
  stripedRows,
  columns,
  tableTitle,
  onClose,
  onDensityChange,
  onRowsPerPageChange,
  onToggleGridLines,
  onToggleColumnSeparators,
  onToggleStripedRows,
  onToggleColumnVisibility,
  onTableTitleChange,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumn,
}: TableSettingsProps) {
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<ColumnType>("text");
  const visibleColumnCount = columns.filter((column) => column.visible).length;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleAddColumn = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) {
      return;
    }

    onAddColumn({ label: trimmed, type: newType });
    setNewLabel("");
    setNewType("text");
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
          onClick={onClose}
        >
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Table settings"
            className="w-full max-w-4xl rounded-2xl border border-black/10 bg-[#fdfcf7] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 size={18} aria-hidden="true" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  Table settings
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close settings"
                onClick={onClose}
                className="rounded-md border border-transparent p-1.5 text-neutral-500 transition hover:border-black/10 hover:bg-white hover:text-neutral-900"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>

            <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)]">
              <aside className="hidden border-r border-black/10 pr-4 md:block">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Sections
                </p>
                <nav aria-label="Settings sections" className="space-y-1">
                  <a
                    href="#table-title"
                    className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-900"
                  >
                    Table title
                  </a>
                  <a
                    href="#density-settings"
                    className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-900"
                  >
                    Row density
                  </a>
                  <a
                    href="#pagination-settings"
                    className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-900"
                  >
                    Pagination
                  </a>
                  <a
                    href="#display-settings"
                    className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-900"
                  >
                    Display
                  </a>
                  <a
                    href="#column-management"
                    className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-white hover:text-neutral-900"
                  >
                    Column management
                  </a>
                </nav>
              </aside>

              <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
                <section id="table-title" aria-label="Table title settings">
                  <label
                    htmlFor="table-title-input"
                    className="mb-2 block text-sm font-semibold text-neutral-900"
                  >
                    Table title
                  </label>
                  <input
                    id="table-title-input"
                    type="text"
                    value={tableTitle}
                    onChange={(event) => onTableTitleChange(event.currentTarget.value)}
                    onBlur={(event) => {
                      if (!event.currentTarget.value.trim()) {
                        onTableTitleChange("My table");
                      }
                    }}
                    placeholder="My table"
                    aria-label="Table title"
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                  />
                </section>

                <section id="density-settings" aria-label="Density settings">
                  <p className="mb-3 text-sm font-semibold text-neutral-900">
                    Row density
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {densityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={density === option.value}
                        onClick={() => onDensityChange(option.value)}
                        className={`rounded-md border px-3 py-1.5 text-sm transition ${
                          density === option.value
                            ? "border-sky-400 bg-sky-50 text-sky-800"
                            : "border-black/10 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-900"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section id="pagination-settings" aria-label="Pagination settings">
                  <label
                    htmlFor="rows-per-page"
                    className="mb-2 block text-sm font-semibold text-neutral-900"
                  >
                    Rows per page
                  </label>
                  <select
                    id="rows-per-page"
                    value={rowsPerPage}
                    onChange={(event) =>
                      onRowsPerPageChange(Number(event.currentTarget.value))
                    }
                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                  >
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} rows
                      </option>
                    ))}
                  </select>
                </section>

                <section
                  id="display-settings"
                  aria-label="Display settings"
                  className="space-y-3"
                >
                  <p className="text-sm font-semibold text-neutral-900">Display</p>
                  <label className="flex items-center justify-between rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-neutral-700">
                    Grid lines
                    <input
                      type="checkbox"
                      checked={showGridLines}
                      onChange={onToggleGridLines}
                      aria-label="Toggle grid lines"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-neutral-700">
                    Column separators
                    <input
                      type="checkbox"
                      checked={showColumnSeparators}
                      onChange={onToggleColumnSeparators}
                      aria-label="Toggle column separators"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-neutral-700">
                    Striped rows
                    <input
                      type="checkbox"
                      checked={stripedRows}
                      onChange={onToggleStripedRows}
                      aria-label="Toggle striped rows"
                    />
                  </label>
                </section>

                <section
                  id="column-management"
                  aria-label="Column management"
                  className="space-y-3"
                >
                  <p className="text-sm font-semibold text-neutral-900">
                    Column management
                  </p>

                  <div className="rounded-lg border border-black/10 bg-white p-3">
                    <p className="mb-3 text-sm font-semibold text-neutral-900">
                      Add a new column
                    </p>
                    <div className="grid gap-2 sm:grid-cols-[1fr_150px_auto]">
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(event) => setNewLabel(event.currentTarget.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddColumn();
                          }
                        }}
                        placeholder="Column label"
                        aria-label="New column label"
                        className="rounded-md border border-black/10 px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                      />
                      <select
                        value={newType}
                        onChange={(event) =>
                          setNewType(event.currentTarget.value as ColumnType)
                        }
                        aria-label="New column type"
                        className="rounded-md border border-black/10 px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddColumn}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-black"
                      >
                        <Plus size={14} aria-hidden="true" />
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {columns.map((column, index) => (
                      <div
                        key={column.id}
                        className="grid items-center gap-2 rounded-lg border border-black/10 bg-white p-3 sm:grid-cols-[1fr_auto_auto_auto]"
                      >
                        <input
                          defaultValue={column.label}
                          key={`${column.id}-${column.label}`}
                          onBlur={(event) => {
                            const value = event.currentTarget.value.trim();
                            if (!value) {
                              event.currentTarget.value = column.label;
                              return;
                            }
                            if (value !== column.label) {
                              onRenameColumn(column.id, value);
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              event.currentTarget.blur();
                            }
                            if (event.key === "Escape") {
                              event.preventDefault();
                              event.currentTarget.value = column.label;
                              event.currentTarget.blur();
                            }
                          }}
                          aria-label={`Rename column ${column.label}`}
                          className="rounded-md border border-black/10 px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                        />

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Move ${column.label} up`}
                            disabled={index === 0}
                            onClick={() => onMoveColumn(column.id, "up")}
                            className="rounded-md border border-black/10 p-2 text-neutral-700 transition hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ArrowUp size={14} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${column.label} down`}
                            disabled={index === columns.length - 1}
                            onClick={() => onMoveColumn(column.id, "down")}
                            className="rounded-md border border-black/10 p-2 text-neutral-700 transition hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ArrowDown size={14} aria-hidden="true" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-pressed={column.visible}
                          onClick={() => onToggleColumnVisibility(column.id)}
                          disabled={visibleColumnCount === 1 && column.visible}
                          className={`rounded-md border px-3 py-2 text-sm transition ${
                            column.visible
                              ? "border-sky-300 bg-sky-50 text-sky-800"
                              : "border-black/10 bg-white text-neutral-700 hover:border-neutral-300"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {column.visible ? "Visible" : "Hidden"}
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete column ${column.label}`}
                          disabled={columns.length === 1}
                          onClick={() => onDeleteColumn(column.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
