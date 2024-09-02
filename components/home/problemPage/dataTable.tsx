"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProblems } from "@/core/actions/problem/getAllProblems";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoInvertModeOutline } from "react-icons/io5";
import { DataTablePagination } from "./dataTablePagination";

interface DataType {
  id: string;
  status: string;
  title: string;
  difficulty: string;
  acceptance: number;
}

interface DataTableProps<TData extends DataType, TValue> {
  columns: ColumnDef<TData, TValue>[] | [];
  data: TData[];
}

export function DataTable<TData extends DataType, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [data, setData] = useState<
    {
      title: string;
      difficulty: string;
      acceptancePercentage: string;
    }[]
  >([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getAllProblems();
      setData(data);
      console.log(data);
    };
    fetchData();
  }, []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4 w-full justify-between">
        <div className="flex items-center gap-4 justify-between w-full">
          <div className="flex gap-4 items-center">
            <div className="flex items-center">
              <Select
                onValueChange={(value) =>
                  table
                    .getColumn("difficulty")
                    ?.setFilterValue(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Select
                onValueChange={(value) =>
                  table
                    .getColumn("status")
                    ?.setFilterValue(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="ATTEMPTED">Attempted</SelectItem>
                  <SelectItem value="NOT ATTEMPTED">Not Attempted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex bg-gray-100 items-center px-3 rounded-md">
            <Search size={20} className="text-gray-500" />
            <Input
              placeholder="Search Questions"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm border-none focus-visible:ring-offset-0  bg-inherit focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md">
        <Table className="">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="capitalize">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  className={cn("border-b-0", index % 2 != 0 && "bg-gray-100")}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "p-3",
                        cell.column.id === "difficulty" && {
                          "text-green-600": cell.getValue() === "EASY",
                          "text-red-600": cell.getValue() === "HARD",
                          "text-yellow-400": cell.getValue() === "MEDIUM",
                        },
                        cell.column.id === "status" &&
                          "flex items-center gap-2",
                      )}
                    >
                      {cell.column.id === "status" ? (
                        <>
                          {cell.getValue() === "ACCEPTED" && (
                            <IoMdCheckmarkCircleOutline
                              className="text-green-500"
                              size={20}
                            />
                          )}
                          {cell.getValue() === "ATTEMPTED" && (
                            <IoInvertModeOutline
                              size={20}
                              className="text-amber-400"
                            />
                          )}
                        </>
                      ) : cell.column.id === "title" ? (
                        <>
                          {index + 1}.{" "}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                      {cell.column.id === "acceptance" && "%"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-2 py-4">
        <div className="flex w-full">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
