"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T, index: number) => void;
  variant?: "default" | "destructive" | "outline" | "ghost";
  show?: (row: T) => boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  actions?: DataTableAction<T>[];
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showPagination?: boolean;
  showSearch?: boolean;
  emptyMessage?: string;
  rowsPerPageOptions?: number[];
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[], selectedRows: T[]) => void;
  getRowId?: (row: T) => string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  error = null,
  actions,
  onSearch,
  searchPlaceholder = "Search...",
  pagination,
  onPageChange,
  onLimitChange,
  showPagination = true,
  showSearch = true,
  emptyMessage = "No data found",
  rowsPerPageOptions = [10, 25, 50],
  selectable = false,
  onSelectionChange,
  getRowId = (row) => row._id || row.id,
  striped = true,
  hoverable = true,
  compact = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;

    if (sortColumn === column.key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column.key);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length && data.length > 0) {
      setSelectedRows(new Set());
      onSelectionChange?.([], []);
    } else {
      const allIds = new Set(data.map((row) => getRowId(row)));
      setSelectedRows(allIds);
      onSelectionChange?.(
        Array.from(allIds),
        data
      );
    }
  };

  const handleSelectRow = (rowId: string, row: T) => {
    const newSelected = new Set(selectedRows);

    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }

    setSelectedRows(newSelected);

    const selectedRowsData = data.filter((r) =>
      newSelected.has(getRowId(r))
    );
    onSelectionChange?.(Array.from(newSelected), selectedRowsData);
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !data) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  const displayData = pagination ? data : sortedData;

  return (
    <div className="space-y-4 w-full">
      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    checked={
                      data.length > 0 &&
                      selectedRows.size === data.length
                    }
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && actions.length > 0 && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <>
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {selectable && <TableCell />}
                      {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                      {actions && actions.length > 0 && <TableCell />}
                    </TableRow>
                  ))}
              </>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="text-center py-8"
                >
                  <p className="text-red-500">{error}</p>
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && displayData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="text-center py-8"
                >
                  <p className="text-muted-foreground">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              displayData.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = selectedRows.has(rowId);

                return (
                  <TableRow
                    key={rowId}
                    className={cn(
                      striped && index % 2 === 0 ? "bg-muted/30" : "",
                      isSelected ? "bg-blue-50 dark:bg-blue-950/20" : ""
                    )}
                  >
                    {selectable && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId, row)}
                          className="cursor-pointer"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(row[column.key], row, index)
                          : row[column.key]}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {actions
                            .filter((action) => !action.show || action.show(row))
                            .map((action, idx) => (
                              <Button
                                key={idx}
                                variant={action.variant || "ghost"}
                                size="sm"
                                onClick={() => action.onClick(row, index)}
                                title={action.label}
                              >
                                {action.icon || action.label}
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page:</span>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => onLimitChange?.(parseInt(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rowsPerPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-sm">
                Page {pagination.page} of {pagination.pages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
