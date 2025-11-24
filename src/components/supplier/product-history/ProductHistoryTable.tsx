'use client'

import { useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'
import { createClient } from '@/utils/supabase/client'
import { FaSearch, FaTrashRestore, FaEdit, FaArchive } from 'react-icons/fa'

export type Product = {
    id: string
    product_name: string
    product_category: string
    city: string
    country_code: string
    suggested_retail_price: number
    currency: string
    status: 'active' | 'draft' | 'archived'
    validity_end_date: string
}

interface ProductHistoryTableProps {
    products: Product[]
    onRestore: (id: string) => void
    onArchive: (id: string) => void
}

export default function ProductHistoryTable({ products, onRestore, onArchive }: ProductHistoryTableProps) {
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                accessorKey: 'product_name',
                header: 'Product Name',
                cell: (info) => <span className="font-medium text-white">{info.getValue() as string}</span>,
            },
            {
                accessorKey: 'product_category',
                header: 'Category',
            },
            {
                accessorKey: 'city',
                header: 'Location',
                cell: (info) => `${info.getValue()}, ${info.row.original.country_code}`,
            },
            {
                accessorKey: 'suggested_retail_price',
                header: 'Suggested Retail Price',
                cell: (info) => `${info.row.original.currency} ${info.getValue()}`,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: (info) => {
                    const status = info.getValue() as string
                    let colorClass = 'bg-gray-700 text-gray-300'
                    if (status === 'active') colorClass = 'bg-teal-900 text-teal-300'
                    if (status === 'archived') colorClass = 'bg-red-900 text-red-300'

                    return (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                            {status.toUpperCase()}
                        </span>
                    )
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (info) => {
                    const product = info.row.original
                    return (
                        <div className="flex space-x-2">
                            {product.status === 'archived' ? (
                                <button
                                    onClick={() => onRestore(product.id)}
                                    className="p-1 text-teal-400 hover:text-teal-300"
                                    title="Restore"
                                >
                                    <FaTrashRestore />
                                </button>
                            ) : (
                                <button
                                    onClick={() => onArchive(product.id)}
                                    className="p-1 text-red-400 hover:text-red-300"
                                    title="Archive"
                                >
                                    <FaArchive />
                                </button>
                            )}
                        </div>
                    )
                },
            },
        ],
        [onRestore, onArchive]
    )

    const table = useReactTable({
        data: products,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="space-y-4">
            {/* Smart Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-500" />
                </div>
                <input
                    type="text"
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search products, cities, categories..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700 bg-gray-800">
                    <thead className="bg-gray-900">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-750 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-400">
                            Showing <span className="font-medium text-white">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
                            <span className="font-medium text-white">
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    products.length
                                )}
                            </span>{' '}
                            of <span className="font-medium text-white">{products.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
