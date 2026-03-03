"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import TableView from "@/components/table/TableView";
import type { TableColumn, TableRow } from "@/components/table/types";

const mockColumns: TableColumn[] = [
  {
    id: "project",
    label: "Project",
    type: "text",
    visible: true,
    sortable: true,
  },
  {
    id: "owner",
    label: "Owner",
    type: "text",
    visible: true,
    sortable: true,
  },
  {
    id: "status",
    label: "Status",
    type: "text",
    visible: true,
    sortable: true,
  },
  {
    id: "priority",
    label: "Priority",
    type: "text",
    visible: true,
    sortable: true,
  },
  {
    id: "budget",
    label: "Budget (USD)",
    type: "number",
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

const mockRows: TableRow[] = [
  {
    id: "row-1",
    project: "Atlas Migration",
    owner: "Sophie",
    status: "In Progress",
    priority: "High",
    budget: 42000,
    active: true,
  },
  {
    id: "row-2",
    project: "AI Documentation Hub",
    owner: "Martin",
    status: "Draft",
    priority: "Medium",
    budget: 16000,
    active: true,
  },
  {
    id: "row-3",
    project: "Billing API v2",
    owner: "Nina",
    status: "Blocked",
    priority: "High",
    budget: 28500,
    active: false,
  },
  {
    id: "row-4",
    project: "Landing Refresh",
    owner: "Lucas",
    status: "Done",
    priority: "Low",
    budget: 12000,
    active: true,
  },
  {
    id: "row-5",
    project: "Data Quality Sprint",
    owner: "Emma",
    status: "In Progress",
    priority: "Medium",
    budget: 19000,
    active: true,
  },
  {
    id: "row-6",
    project: "Mobile Navigation Revamp",
    owner: "Noah",
    status: "Review",
    priority: "Medium",
    budget: 14000,
    active: true,
  },
  {
    id: "row-7",
    project: "Security Audit",
    owner: "Camille",
    status: "In Progress",
    priority: "High",
    budget: 31000,
    active: true,
  },
  {
    id: "row-8",
    project: "Search Index Rebuild",
    owner: "Liam",
    status: "Draft",
    priority: "Low",
    budget: 11000,
    active: false,
  },
  {
    id: "row-9",
    project: "Design Tokens Cleanup",
    owner: "Mila",
    status: "Done",
    priority: "Low",
    budget: 8000,
    active: true,
  },
  {
    id: "row-10",
    project: "Support Portal",
    owner: "Jules",
    status: "In Progress",
    priority: "High",
    budget: 27000,
    active: true,
  },
  {
    id: "row-11",
    project: "Feature Flags Rollout",
    owner: "Iris",
    status: "Review",
    priority: "Medium",
    budget: 15000,
    active: true,
  },
  {
    id: "row-12",
    project: "Analytics Pipeline",
    owner: "Hugo",
    status: "Blocked",
    priority: "High",
    budget: 36000,
    active: false,
  },
  {
    id: "row-13",
    project: "Knowledge Base Import",
    owner: "Lena",
    status: "In Progress",
    priority: "Medium",
    budget: 17000,
    active: true,
  },
  {
    id: "row-14",
    project: "Webhook Reliability",
    owner: "Theo",
    status: "Draft",
    priority: "High",
    budget: 22000,
    active: true,
  },
  {
    id: "row-15",
    project: "Partner Dashboard",
    owner: "Ava",
    status: "Review",
    priority: "Medium",
    budget: 20500,
    active: true,
  },
];

export default function TablePage() {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowHeader(false);
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <main className="px-6 pb-16 pt-24">
      <section className="mx-auto max-w-6xl space-y-8">
        <AnimatePresence initial={false}>
          {showHeader ? (
            <motion.header
              initial={{ opacity: 1, y: 0, height: "auto" }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{
                opacity: 0,
                y: -14,
                height: 0,
                marginBottom: 0,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="space-y-3 overflow-hidden"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Data Workspace
              </p>
              <h1 className="text-4xl font-semibold text-neutral-900">Table</h1>
              <p className="max-w-3xl text-base leading-7 text-neutral-700">
                Sort, edit, and organize your dataset with configurable columns,
                row actions, and bulk operations.
              </p>
            </motion.header>
          ) : null}
        </AnimatePresence>

        <div className="rounded-2xl border border-black/10 bg-[#f0f0eb]/70 p-4 sm:p-6">
          <TableView data={mockRows} initialColumns={mockColumns} />
        </div>
      </section>
    </main>
  );
}
