"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RowActionsProps {
  rowLabel: string;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function RowActions({
  rowLabel,
  onDuplicate,
  onDelete,
}: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label={`Open actions for ${rowLabel}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="rounded-md border border-transparent p-1.5 text-neutral-500 transition hover:border-black/10 hover:bg-neutral-50 hover:text-neutral-900"
      >
        <MoreHorizontal size={16} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-label={`Row actions for ${rowLabel}`}
            className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-black/10 bg-white p-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDuplicate();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Copy size={14} aria-hidden="true" />
              Duplicate row
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 transition hover:bg-red-50"
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete row
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
