"use client"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/reportes/table"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })
	const [page, setPage] = useState(0);

  return (
    <div className="rounded-md border overflow-x-scroll w-full max-h-screen -ml-12">
      <Table>
        <TableHeader className="bg-sky-300 sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className='font-bold' key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/*Paginador*/}
      <div className="flex items-center justify-center sticky bottom-0 p-2 space-x-2 rounded-md right-10 bg-slate-400">
        <ArrowLeftIcon className='w-6 h-6 cursor-pointer hover:bg-sky-500 roundend-xl' onClick={() => {table.previousPage(); if(page>0) setPage(page-1)}} />
        <span className='text-xl'>{page}</span>
        <ArrowRightIcon className='w-6 h-6 cursor-pointer hover:bg-sky-500 roundend-xl' onClick={() => {table.nextPage(); if(table.getCanNextPage()) setPage(page+1)}} />
      </div>
    </div>
  )
}
