"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export type ColumnDef<T> = {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortType?: 'string' | 'number';
};

interface SortableTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  emptyMessage?: string;
}

export function SortableTable<T extends { id?: string | number }>({
  data,
  columns,
  defaultSortKey,
  defaultSortDir = "desc",
  emptyMessage = "No data found",
}: SortableTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(
    defaultSortKey ? { key: defaultSortKey, direction: defaultSortDir } : null
  );

  const handleSort = (key: string, isSortable?: boolean) => {
    if (isSortable === false) return;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a: T, b: T) => {
    if (!sortConfig) return 0;
    
    const column = columns.find(c => c.accessorKey === sortConfig.key);
    let valA = (a as Record<string, unknown>)[sortConfig.key];
    let valB = (b as Record<string, unknown>)[sortConfig.key];

    // Handle nested properties if needed, e.g., a['_count']?.keywords
    if (sortConfig.key.includes('.')) {
      const parts = sortConfig.key.split('.');
      valA = parts.reduce((obj, p) => (obj ? (obj as Record<string, unknown>)[p] : undefined), a as unknown);
      valB = parts.reduce((obj, p) => (obj ? (obj as Record<string, unknown>)[p] : undefined), b as unknown);
    }

    if (valA === null || valA === undefined) return sortConfig.direction === "asc" ? -1 : 1;
    if (valB === null || valB === undefined) return sortConfig.direction === "asc" ? 1 : -1;

    if (column?.sortType === 'number') {
      valA = Number(valA);
      valB = Number(valB);
    }

    if ((valA as number | string) < (valB as number | string)) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if ((valA as number | string) > (valB as number | string)) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="rounded-xl border border-border overflow-x-auto bg-card/50 shadow-sm">
      <table className="w-full text-sm text-left min-w-max">
        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessorKey)}
                className={`px-6 py-4 font-medium select-none ${col.sortable !== false ? 'cursor-pointer hover:bg-muted/70 transition-colors' : ''}`}
                onClick={() => handleSort(String(col.accessorKey), col.sortable)}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable !== false && (
                    <span className="flex-shrink-0 text-muted-foreground/50">
                      {sortConfig?.key === col.accessorKey ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-primary" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedData.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-muted/30 transition-colors">
              {columns.map((col) => (
                <td key={String(col.accessorKey)} className="px-6 py-4">
                  {col.cell ? col.cell(row) : ((row as Record<string, unknown>)[col.accessorKey as string] as React.ReactNode) || "—"}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
