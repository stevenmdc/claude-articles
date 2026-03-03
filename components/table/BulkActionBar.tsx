"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Trash2, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onExportSelected: () => void;
  onClearSelection: () => void;
}

export default function BulkActionBar({
  selectedCount,
  totalCount,
  allSelected,
  onToggleSelectAll,
  onDeleteSelected,
  onExportSelected,
  onClearSelection,
}: BulkActionBarProps) {
  return (
    <AnimatePresence initial={false}>
      {selectedCount > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
          role="region"
          aria-label="Bulk actions"
        >
          <p className="text-sm text-neutral-700">
            <span className="font-semibold text-neutral-900">{selectedCount}</span>{" "}
            row{selectedCount > 1 ? "s" : ""} selected
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleSelectAll}
              className="rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
            >
              {allSelected ? "Unselect all" : `Select all (${totalCount})`}
            </button>

            <button
              type="button"
              onClick={onExportSelected}
              className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
            >
              <Download size={14} aria-hidden="true" />
              Export
            </button>

            <button
              type="button"
              onClick={onDeleteSelected}
              className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 rounded-md border border-transparent px-2.5 py-1.5 text-sm text-neutral-600 transition hover:text-neutral-900"
            >
              <X size={14} aria-hidden="true" />
              Clear
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
