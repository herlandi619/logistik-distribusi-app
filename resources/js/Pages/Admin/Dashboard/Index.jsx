import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ stats, items, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.dashboard'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Ringkasan Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <p className="text-gray-500">Total Jenis Barang</p>
                            <h3 className="text-3xl font-bold">{stats.total_items}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                            <p className="text-gray-500">Total Barang Masuk</p>
                            <h3 className="text-3xl font-bold">{stats.total_stock_in}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                            <p className="text-gray-500">Total Barang Keluar</p>
                            <h3 className="text-3xl font-bold">{stats.total_stock_out}</h3>
                        </div>
                    </div>

                    {/* Tabel Monitoring Low Stock */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Monitoring Stok Menipis</h3>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari barang..."
                                    className="border-gray-300 rounded-md text-sm"
                                />
                                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">Cari</button>
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-4 py-3">Nama Barang</th>
                                        <th className="px-4 py-3 text-center">Stok Sisa</th>
                                        <th className="px-4 py-3 text-center">Stok Minimum</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-sm">
                                    {items.data.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">{item.nama_barang}</td>
                                            <td className="px-4 py-3 text-center font-bold text-red-600">{item.stok}</td>
                                            <td className="px-4 py-3 text-center">{item.stok_minimum}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Perlu Restock</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex space-x-1">
                            {items.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 border rounded text-xs ${link.active ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}