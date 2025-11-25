'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

type Booking = {
    id: string
    product: { product_name: string }
    client_name: string
    num_travelers: number
    travel_start_date: string
    total_agent_price: number
    inquiry_status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
    created_at: string
}

const columnHelper = createColumnHelper<Booking>()

export default function AgentBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [sorting, setSorting] = useState<SortingState>([])
    const supabase = createClient()

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    product:products(product_name)
                `)
                .eq('agent_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching bookings:', error)
            } else {
                setBookings(data || [])
            }
        }
        setLoading(false)
    }

    const columns = useMemo(() => [
        columnHelper.accessor('product.product_name', {
            header: 'Product',
            cell: info => info.getValue() || 'Unknown Product',
        }),
        columnHelper.accessor('client_name', {
            header: 'Client Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('travel_start_date', {
            header: 'Travel Date',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.accessor('num_travelers', {
            header: 'Travelers',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('total_agent_price', {
            header: 'Total Price',
            cell: info => `$${info.getValue().toLocaleString()}`,
        }),
        columnHelper.accessor('inquiry_status', {
            header: 'Status',
            cell: info => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue() === 'confirmed' ? 'bg-green-900 text-green-300' :
                        info.getValue() === 'rejected' ? 'bg-red-900 text-red-300' :
                            info.getValue() === 'cancelled' ? 'bg-gray-700 text-gray-300' :
                                'bg-yellow-900 text-yellow-300'
                    }`}>
                    {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
                </span>
            ),
        }),
        columnHelper.accessor('created_at', {
            header: 'Requested On',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
    ], [])

    const table = useReactTable({
        data: bookings,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
                        <p className="text-gray-400">You haven't made any booking requests yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-gray-900 rounded-xl border border-gray-800">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-800 text-gray-300 uppercase border-b border-gray-700">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-4 cursor-pointer hover:bg-gray-750 transition-colors select-none"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: <FaSortUp />,
                                                        desc: <FaSortDown />,
                                                    }[header.column.getIsSorted() as string] ?? <FaSort className="text-gray-600" />}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-800/50 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
