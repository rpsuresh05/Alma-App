"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  initialSort?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 4,
  initialSort = [],
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: true,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
      sorting: initialSort,
    },
  });

  const getVisiblePages = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();

    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    if (currentPage < 2) {
      return [0, 1, 2];
    }

    if (currentPage > totalPages - 3) {
      return [totalPages - 3, totalPages - 2, totalPages - 1];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  return (
    <div className="">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" && (
                      <ArrowUp className="w-4 h-4" />
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center border-t justify-end space-x-2 px-4 py-2">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-8 h-8 p-0 border-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={"outline"}
            onClick={() => table.setPageIndex(page)}
            className={`w-8 h-8 p-0 ${
              table.getState().pagination.pageIndex !== page
                ? "border-none"
                : ""
            } `}
          >
            {page + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-8 h-8 p-0 border-none"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
