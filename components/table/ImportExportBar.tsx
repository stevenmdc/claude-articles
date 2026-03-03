"use client";

import { Download, FileDown, FileUp } from "lucide-react";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import type { TableColumn, TableRow } from "@/components/table/types";

interface ImportExportBarProps {
  columns: TableColumn[];
  rows: TableRow[];
  onImport: (columns: TableColumn[], rows: TableRow[]) => void;
  showTemplateLink?: boolean;
}

interface ImportPayload {
  columns: TableColumn[];
  rows: TableRow[];
}

type MessageState =
  | { type: "error"; text: string }
  | { type: "success"; text: string }
  | null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidColumnType(value: unknown): value is TableColumn["type"] {
  return value === "text" || value === "number" || value === "boolean";
}

function validateImportPayload(input: unknown): ImportPayload {
  if (!isRecord(input)) {
    throw new Error("Invalid JSON: root must be an object.");
  }

  const columns = input.columns;
  const rows = input.rows;

  if (!Array.isArray(columns)) {
    throw new Error("Invalid JSON: 'columns' must be an array.");
  }

  if (!Array.isArray(rows)) {
    throw new Error("Invalid JSON: 'rows' must be an array.");
  }

  const parsedColumns: TableColumn[] = columns.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Invalid column at index ${index}: must be an object.`);
    }

    const { id, label, type, visible, sortable } = item;

    if (typeof id !== "string" || id.trim() === "") {
      throw new Error(`Invalid column at index ${index}: 'id' must be a string.`);
    }

    if (typeof label !== "string" || label.trim() === "") {
      throw new Error(
        `Invalid column '${id}': 'label' must be a non-empty string.`,
      );
    }

    if (!isValidColumnType(type)) {
      throw new Error(
        `Invalid column '${id}': 'type' must be 'text', 'number' or 'boolean'.`,
      );
    }

    if (typeof visible !== "boolean") {
      throw new Error(`Invalid column '${id}': 'visible' must be boolean.`);
    }

    if (typeof sortable !== "boolean") {
      throw new Error(`Invalid column '${id}': 'sortable' must be boolean.`);
    }

    return {
      id,
      label,
      type,
      visible,
      sortable,
    };
  });

  const columnIdSet = new Set(parsedColumns.map((column) => column.id));
  if (columnIdSet.size !== parsedColumns.length) {
    throw new Error("Invalid JSON: duplicate column ids are not allowed.");
  }

  const parsedRows: TableRow[] = rows.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Invalid row at index ${index}: must be an object.`);
    }

    const { id } = item;
    if (typeof id !== "string" || id.trim() === "") {
      throw new Error(`Invalid row at index ${index}: 'id' must be a string.`);
    }

    const row: TableRow = { id };
    for (const [key, value] of Object.entries(item)) {
      if (key === "id") {
        continue;
      }

      if (
        value !== null &&
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean"
      ) {
        throw new Error(
          `Invalid row '${id}': field '${key}' must be string, number, boolean or null.`,
        );
      }

      row[key] = value;
    }

    return row;
  });

  const rowIdSet = new Set(parsedRows.map((row) => row.id));
  if (rowIdSet.size !== parsedRows.length) {
    throw new Error("Invalid JSON: duplicate row ids are not allowed.");
  }

  return {
    columns: parsedColumns,
    rows: parsedRows,
  };
}

function downloadJsonFile(filename: string, content: unknown) {
  const json = JSON.stringify(content, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ImportExportBar({
  columns,
  rows,
  onImport,
  showTemplateLink = true,
}: ImportExportBarProps) {
  const [message, setMessage] = useState<MessageState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const handleImportClick = () => {
    setMessage(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const validated = validateImportPayload(parsed);

      onImport(validated.columns, validated.rows);
      setMessage({
        type: "success",
        text: `Import successful: ${validated.columns.length} columns and ${validated.rows.length} rows loaded.`,
      });
    } catch (error) {
      const fallback = "Import failed: invalid JSON file.";
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : fallback,
      });
    } finally {
      input.value = "";
    }
  };

  const handleExportJson = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadJsonFile(`table-export-${date}.json`, { columns, rows });
    setMessage({
      type: "success",
      text: "Export completed.",
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

    downloadJsonFile("table-template.json", {
      columns: templateColumns,
      rows: templateRows,
    });
    setMessage({
      type: "success",
      text: "Template downloaded.",
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <input
          id={fileInputId}
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Import table JSON file"
        />

        <button
          type="button"
          onClick={handleImportClick}
          aria-label="Import JSON"
          className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
        >
          <FileUp size={14} aria-hidden="true" />
          Import JSON
        </button>

        <button
          type="button"
          onClick={handleExportJson}
          aria-label="Export JSON"
          className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900"
        >
          <FileDown size={14} aria-hidden="true" />
          Export JSON
        </button>
      </div>

      {showTemplateLink ? (
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 transition hover:text-sky-700"
        >
          <Download size={12} aria-hidden="true" />
          Download template
        </button>
      ) : null}

      {message ? (
        <p
          role="status"
          className={`text-xs ${
            message.type === "error" ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
