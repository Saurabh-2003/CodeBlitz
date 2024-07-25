"use client"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { PaginationEllipsis } from "@/components/ui/pagination"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {

  const currentPage = table.getState().pagination.pageIndex
  return (
    <div className="flex items-center px-2 w-full ">
      <div className="flex items-center w-full justify-between">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[110px] bg-gray-100 border-none text-gray-600 focus-visible:ring-0">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}/ page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        <div className="flex items-center space-x-2">

          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-none rounded-sm text-gray-700 bg-gray-100"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          {currentPage !== 0 && <Button
            className={cn("border-none rounded-sm text-gray-700 bg-gray-100", 0 === currentPage && "text-black shadow-md bg-white")}
            variant="outline"
            onClick={() => table.setPageIndex(0)}
          >
            1
          </Button>}
          {currentPage >1 && <PaginationEllipsis/>}
          {Array.from({ length: Math.min(2, table.getPageCount() - currentPage) }).map((_, index) => {
            const pageIndex = currentPage + index; // Correct page index
            return (
              <Button
                key={pageIndex}
                className={cn(
                  "border-none rounded-sm text-gray-700 bg-gray-100",
                  pageIndex === currentPage && "text-black shadow-md bg-white"
                )}
                variant="outline"
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {pageIndex + 1}
              </Button>
            );
          })}
          {currentPage < table.getPageCount() - 2 && <PaginationEllipsis/>}
          {currentPage < table.getPageCount() - 2 &&  <Button
            className={cn("border-none rounded-sm text-gray-700 bg-gray-100", table.getPageCount() - 1 === currentPage && "text-black shadow-md bg-white")}
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            {table.getPageCount()}
          </Button>}

          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-none rounded-sm text-gray-700 bg-gray-100"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-5 w-5" />
          </Button>

        </div>
      </div>
    </div>
  )
}
