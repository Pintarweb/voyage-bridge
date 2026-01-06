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
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaExternalLinkAlt } from 'react-icons/fa'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'

type Booking = {
    id: string
    product: {
        id: string
        product_name: string
        currency: string
        supplier: {
            company_name: string
        }
    }
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
    const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'history'>('pending')
    const [globalFilter, setGlobalFilter] = useState('')
    const supabase = createClient()
    const { convertPrice, symbol } = useCurrency()

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
                    product:products (
                        id,
                        product_name,
                        currency,
                        supplier:suppliers (
                            company_name
                        )
                    )
                `)
                .eq('agent_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching bookings:', error)
            } else {
                setBookings(data as any || [])
            }
        }
        setLoading(false)
    }

    // Filter data based on tabs
    const filteredData = useMemo(() => {
        return bookings.filter(booking => {
            if (activeTab === 'pending') return booking.inquiry_status === 'pending'
            if (activeTab === 'active') return booking.inquiry_status === 'confirmed'
            if (activeTab === 'history') return ['rejected', 'cancelled'].includes(booking.inquiry_status)
            return true
        }).filter(booking => {
            if (!globalFilter) return true
            const search = globalFilter.toLowerCase()
            return (
                booking.client_name.toLowerCase().includes(search) ||
                booking.product.product_name.toLowerCase().includes(search) ||
                booking.product.supplier?.company_name.toLowerCase().includes(search)
            )
        })
    }, [bookings, activeTab, globalFilter])

    const columns = useMemo(() => [
        columnHelper.accessor('product.product_name', {
            header: 'Product',
            cell: info => (
                <Link
                    href={`/agent-portal/product/${info.row.original.product.id}`}
                    className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium group"
                >
                    {info.getValue()}
                    <FaExternalLinkAlt className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            ),
        }),
        columnHelper.accessor('product.supplier.company_name', {
            header: 'Supplier Name',
            cell: info => <span className="text-gray-300">{info.getValue() || 'N/A'}</span>,
        }),
        columnHelper.accessor('client_name', {
            header: 'Client Name',
            cell: info => <span className="font-medium text-white">{info.getValue()}</span>,
        }),
        columnHelper.accessor('travel_start_date', {
            header: 'Travel Date',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.accessor('total_agent_price', {
            header: 'Agent Net Price',
            cell: info => (
                <span className="font-mono text-teal-400">
                    {symbol} {convertPrice(info.getValue(), info.row.original.product.currency)}
                </span>
            ),
        }),
        columnHelper.accessor('inquiry_status', {
            header: 'Status',
            cell: info => {
                const status = info.getValue()
                let colorClass = 'bg-gray-700 text-gray-300'
                if (status === 'confirmed') colorClass = 'bg-teal-900/50 text-teal-300 border border-teal-700/50'
                if (status === 'pending') colorClass = 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50'
                if (status === 'rejected' || status === 'cancelled') colorClass = 'bg-red-900/50 text-red-300 border border-red-700/50'

                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colorClass}`}>
                        {status}
                    </span>
                )
            },
        }),
    ], [convertPrice, symbol])

    const table = useReactTable({
        data: filteredData,
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Bookings & Inquiries</h1>
                    <p className="text-gray-400 mt-1">Manage your client requests and confirmed trips.</p>
                </div>

                {/* Global Search */}
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search client, product, or supplier..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full bg-[#1A1A20] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10">
                <div className="flex space-x-8">
                    {[
                        { id: 'pending', label: 'Pending' },
                        { id: 'active', label: 'Active' },
                        { id: 'history', label: 'History' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === tab.id
                                ? 'text-teal-400'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading bookings...</div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-20 bg-[#1A1A20] rounded-xl border border-white/5">
                    <p className="text-gray-400">No bookings found in this category.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-[#1A1A20] rounded-xl border border-white/5 shadow-2xl">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/40 text-gray-400 uppercase text-xs font-bold tracking-wider border-b border-white/5">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 cursor-pointer hover:text-white transition-colors select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <FaSortUp className="text-teal-500" />,
                                                    desc: <FaSortDown className="text-teal-500" />,
                                                }[header.column.getIsSorted() as string] ?? <FaSort className="text-gray-700" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-white/5 transition-colors group">
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
    )
}
