"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Columns3, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ColumnType, TableColumn } from "@/components/table/types";

interface ColumnManagerProps {
  open: boolean;
  columns: TableColumn[];
  onClose: () => void;
  onAddColumn: (payload: { label: string; type: ColumnType }) => void;
  onRenameColumn: (columnId: string, label: string) => void;
  onToggleVisibility: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveColumn: (columnId: string, direction: "up" | "down") => void;
}

export default function ColumnManager({
  open,
  columns,
  onClose,
  onAddColumn,
  onRenameColumn,
  onToggleVisibility,
  onDeleteColumn,
  onMoveColumn,
}: ColumnManagerProps) {
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<ColumnType>("text");
  const [labelDrafts, setLabelDrafts] = useState<Record<string, string>>({});
  const visibleCount = columns.filter((column) => column.visible).length;

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

  const commitLabel = (columnId: string) => {
    const value = (labelDrafts[columnId] ?? "").trim();
    if (!value) {
      setLabelDrafts((current) => {
        const existing = columns.find((column) => column.id === columnId);
        return {
          ...current,
          [columnId]: existing?.label ?? "",
        };
      });
      return;
    }
    onRenameColumn(columnId, value);
  };

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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4"
          onClick={onClose}
        >
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Column manager"
            className="w-full max-w-2xl rounded-2xl border border-black/10 bg-[#fdfcf7] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Columns3 size={18} aria-hidden="true" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  Column manager
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close column manager"
                onClick={onClose}
                className="rounded-md border border-transparent p-1.5 text-neutral-500 transition hover:border-black/10 hover:bg-white hover:text-neutral-900"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>

            <section className="mb-5 rounded-lg border border-black/10 bg-white p-3">
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
            </section>

            <section aria-label="Existing columns" className="space-y-2">
              <p className="text-sm font-semibold text-neutral-900">
                Existing columns
              </p>
              <div className="max-h-[52vh] space-y-2 overflow-auto pr-1">
                {columns.map((column, index) => (
                  <div
                    key={column.id}
                    className="grid items-center gap-2 rounded-lg border border-black/10 bg-white p-3 sm:grid-cols-[1fr_auto_auto_auto]"
                  >
                    <input
                      value={labelDrafts[column.id] ?? column.label}
                      onChange={(event) =>
                        setLabelDrafts((current) => ({
                          ...current,
                          [column.id]: event.currentTarget.value,
                        }))
                      }
                      onBlur={() => commitLabel(column.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitLabel(column.id);
                        }
                        if (event.key === "Escape") {
                          setLabelDrafts((current) => ({
                            ...current,
                            [column.id]: column.label,
                          }));
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
                      onClick={() => onToggleVisibility(column.id)}
                      disabled={visibleCount === 1 && column.visible}
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
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
