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
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import React from "react";
import { DataTablePagination } from "../home/problemPage/dataTablePagination";

interface DataType {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  image?: string | null;
}

interface DataTableProps<TData extends DataType, TValue> {
  columns: ColumnDef<TData, TValue>[] | [];
  data: TData[];
  filters: {
    role: string;
    search: string;
  };
  onFilterChange: (filters: { role: string; search: string }) => void;
}

export function UserDataTable<TData extends DataType, TValue>({
  columns,
  data,
  filters,
  onFilterChange,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Filter data based on role and search
  const filteredData = React.useMemo(() => {
    let filtered = data;

    // Filter by role
    if (filters.role && filters.role !== "all") {
      filtered = filtered.filter((item) => item.role === filters.role);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(searchLower)) ||
          (item.email && item.email.toLowerCase().includes(searchLower)),
      );
    }

    return filtered;
  }, [data, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
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
                onValueChange={(value) => {
                  const role = value === "all" ? "" : value;
                  onFilterChange({ ...filters, role });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Role</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex bg-gray-100 items-center px-3 rounded-md">
            <Search size={20} className="text-gray-500" />
            <Input
              placeholder="Search Users"
              value={filters.search}
              onChange={(event) =>
                onFilterChange({ ...filters, search: event.target.value })
              }
              className="max-w-sm border-none focus-visible:ring-offset-0 bg-inherit focus-visible:ring-0"
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  className={cn("border-b-0", index % 2 !== 0 && "bg-gray-100")}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
