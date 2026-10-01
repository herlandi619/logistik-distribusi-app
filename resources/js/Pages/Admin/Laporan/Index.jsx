import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ laporanData, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [search, setSearch] = useState(filters.search || '');

    // Fungsi submit filter
    const handleFilter = (e) => {
        e.preventDefault();

        if (startDate && endDate && startDate > endDate) {
            Swal.fire({
                icon: 'error',
                title: 'Tanggal Tidak Valid',
                text: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai!',
            });
            return;
        }

        router.get(
            route('admin.laporan.index'),
            {
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                search: search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    // Reset filter
    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearch('');
        router.get(
            route('admin.laporan.index'),
            {},
            { preserveState: false, replace: true }
        );
    };

    const handlePrint = () => {
        if (!laporanData.data || laporanData.data.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Kosong',
                text: 'Tidak ada data laporan untuk dicetak.',
            });
            return;
        }
        window.print();
    };

    return (
        <AdminLayout header="Laporan Rekapitulasi Keseluruhan">
            <div className="p-6">
                {/* Form Filter */}
                <div className="print:hidden bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <form onSubmit={handleFilter} className="flex flex-col lg:flex-row gap-4 items-end justify-between">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Cari Barang / Kategori
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Kode, nama, atau kategori..."
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Cetak Laporan
                            </button>
                        </div>
                    </form>
                </div>

                {/* Header Print */}
                <div className="hidden print:block mb-6 text-center">
                    <h1 className="text-2xl font-bold uppercase">Laporan Rekapitulasi Stok Barang</h1>
                    <p className="text-sm text-gray-600">
                        {startDate && endDate
                            ? `Periode: ${startDate} s/d ${endDate}`
                            : 'Periode: Keseluruhan'}
                    </p>
                    <hr className="my-3 border-gray-400" />
                </div>

                {/* Tabel Rekapitulasi */}
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200 print:shadow-none print:border-none">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs print:bg-gray-200">
                            <tr>
                                <th className="p-4 border-b">No</th>
                                <th className="p-4 border-b">Kode Barang</th>
                                <th className="p-4 border-b">Nama Barang</th>
                                <th className="p-4 border-b">Kategori</th>
                                <th className="p-4 border-b text-center text-emerald-600">Total Masuk</th>
                                <th className="p-4 border-b text-center text-rose-600">Total Keluar</th>
                                <th className="p-4 border-b text-center">Stok Akhir</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 print:divide-gray-300">
                            {laporanData.data && laporanData.data.length > 0 ? (
                                laporanData.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-500">{laporanData.from + index}</td>
                                        <td className="p-4 font-mono font-medium text-gray-700">{item.kode_barang}</td>
                                        <td className="p-4 font-semibold text-gray-800">{item.nama_barang}</td>
                                        <td className="p-4 text-gray-600">{item.kategori}</td>
                                        <td className="p-4 text-center font-bold text-emerald-600">
                                            +{item.total_masuk} {item.satuan}
                                        </td>
                                        <td className="p-4 text-center font-bold text-rose-600">
                                            -{item.total_keluar} {item.satuan}
                                        </td>
                                        <td className="p-4 text-center font-bold text-gray-800">
                                            {item.stok} {item.satuan}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500">
                                        Data rekapitulasi tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="print:hidden mt-4 flex gap-1 justify-end">
                    {laporanData.links && laporanData.links.map((link, i) => {
                        let cleanUrl = null;
                        if (link.url) {
                            const urlObj = new URL(link.url);
                            cleanUrl = urlObj.pathname + urlObj.search;
                        }

                        return (
                            <button
                                key={i}
                                type="button"
                                disabled={!cleanUrl}
                                onClick={() => cleanUrl && router.get(cleanUrl, {}, { preserveState: true })}
                                className={`px-3 py-1.5 border text-sm rounded-lg ${
                                    link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                                } ${!cleanUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}