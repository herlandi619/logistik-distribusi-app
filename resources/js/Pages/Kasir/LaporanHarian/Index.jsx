import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import KasirLayout from '@/Layouts/KasirLayout';

export default function Index({ stockOuts, summary, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Handle Filter & Search Request via Inertia
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            '/kasir/laporan-harian',
            { search, start_date: startDate, end_date: endDate },
            { preserveState: true, replace: true }
        );
    };

    // Reset Filter ke Hari Ini
    const handleResetFilter = () => {
        const today = new Date().toISOString().split('T')[0];
        setSearch('');
        setStartDate(today);
        setEndDate(today);
        router.get('/kasir/laporan-harian', { start_date: today, end_date: today });
    };

    // Buka Modal Detail Transaksi
    const handleOpenDetail = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    // Ganti fungsi handleCetakLaporan yang lama di Index.jsx dengan ini:
    const handleCetakLaporan = () => {
        if (stockOuts.data.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Kosong',
                text: 'Tidak ada data transaksi pada periode tanggal ini untuk dicetak.',
            });
            return;
        }

        Swal.fire({
            title: 'Cetak Laporan Penjualan?',
            text: `Mencetak rekapitulasi PDF untuk periode ${startDate} s/d ${endDate}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Buka PDF',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Membuka PDF di tab baru dengan filter tanggal yang dipilih
                window.open(`/kasir/laporan-harian/pdf?start_date=${startDate}&end_date=${endDate}`, '_blank');
            }
        });
    };

    return (
        <KasirLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header Page & Action Button */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Laporan Penjualan Harian</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Rekapitulasi dan analisis pengeluaran barang kepada pelanggan dalam periode tertentu.
                        </p>
                    </div>
                    <button
                        onClick={handleCetakLaporan}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Cetak Rekapitulasi</span>
                    </button>
                </div>

                {/* Stat Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Total Pengiriman</p>
                            <h3 className="text-xl font-bold text-gray-800">{summary.total_transaksi} Transaksi</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Volume Barang Terjual</p>
                            <h3 className="text-xl font-bold text-gray-800">{summary.total_qty} Qty</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Total Omset Periode Ini</p>
                            <h3 className="text-xl font-bold text-emerald-600">Rp {Number(summary.total_omset).toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                </div>

                {/* Filter Box & Main Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Filter Bar */}
                    <form onSubmit={handleFilter} className="p-6 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="text-xs font-semibold text-gray-600">Dari Tanggal</label>
                            <input
                                type="date"
                                className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600">Sampai Tanggal</label>
                            <input
                                type="date"
                                className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600">Kata Kunci Search</label>
                            <input
                                type="text"
                                placeholder="Cari Surat Jalan / Pelanggan / Barang..."
                                className="w-full border border-gray-200 rounded-xl p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-xl text-sm font-medium transition shadow-sm"
                            >
                                Filter Data
                            </button>
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-3 rounded-xl text-sm font-medium transition"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs font-semibold text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">No. Surat Jalan</th>
                                    <th className="px-6 py-4">Tanggal Transaksi</th>
                                    <th className="px-6 py-4">Nama Pelanggan</th>
                                    <th className="px-6 py-4">Barang Terjual</th>
                                    <th className="px-6 py-4 text-center">Jumlah</th>
                                    <th className="px-6 py-4 text-right">Nilai Transaksi</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stockOuts.data.length > 0 ? (
                                    stockOuts.data.map((item) => {
                                        const totalHarga = item.jumlah_keluar * (item.item?.harga_jual || 0);
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
                                                        {item.no_surat_jalan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{item.tanggal_keluar}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-800">{item.customer?.nama_customer || '-'}</div>
                                                    <div className="text-xs text-gray-400 truncate max-w-xs">{item.customer?.alamat || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-800">{item.item?.nama_barang || '-'}</div>
                                                    <div className="text-xs text-gray-400 font-mono">
                                                        @ Rp {Number(item.item?.harga_jual || 0).toLocaleString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <span className="font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                                                        {item.jumlah_keluar} {item.item?.satuan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                                                    Rp {Number(totalHarga).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleOpenDetail(item)}
                                                        className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                                                    >
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-gray-400">
                                            Tidak ada data laporan penjualan pada periode tanggal ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                        <span>Menampilkan <b>{stockOuts.from || 0}</b> - <b>{stockOuts.to || 0}</b> dari <b>{stockOuts.total}</b> data</span>
                        <div className="flex gap-1.5">
                            {stockOuts.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                        link.active
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : link.url
                                            ? 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                                            : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* MODAL BOX DETAIL TRANSAKSI */}
                {modalOpen && selectedItem && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-100">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Rincian Laporan Transaksi</h3>
                                    <p className="text-xs text-gray-500">Detail barang keluar dan info mitra pengiriman.</p>
                                </div>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body Info */}
                            <div className="space-y-3 text-xs text-gray-700">
                                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">No. Surat Jalan:</span>
                                        <span className="font-mono font-bold text-blue-700">{selectedItem.no_surat_jalan}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tanggal Keluar:</span>
                                        <span className="font-semibold">{selectedItem.tanggal_keluar}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Petugas Input:</span>
                                        <span className="font-semibold">{selectedItem.user?.name || '-'}</span>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-3 space-y-1">
                                    <div className="font-bold text-gray-800 mb-1">Tujuan / Pelanggan</div>
                                    <div><b>Nama:</b> {selectedItem.customer?.nama_customer || '-'}</div>
                                    <div><b>Alamat:</b> {selectedItem.customer?.alamat || '-'}</div>
                                    <div><b>Kontak:</b> {selectedItem.customer?.kontak || '-'}</div>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-3 space-y-1.5">
                                    <div className="font-bold text-gray-800">Rincian Nilai Barang</div>
                                    <div className="flex justify-between">
                                        <span>Nama Barang:</span>
                                        <span className="font-semibold text-gray-800">{selectedItem.item?.nama_barang}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Harga Satuan:</span>
                                        <span>Rp {Number(selectedItem.item?.harga_jual || 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Jumlah Keluar:</span>
                                        <span>{selectedItem.jumlah_keluar} {selectedItem.item?.satuan}</span>
                                    </div>
                                    <div className="flex justify-between pt-1.5 border-t border-gray-100 text-sm font-bold text-gray-900">
                                        <span>Total Nilai Omset:</span>
                                        <span className="text-emerald-600">
                                            Rp {Number(selectedItem.jumlah_keluar * (selectedItem.item?.harga_jual || 0)).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Footer */}
                            <div className="flex justify-end pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                                >
                                    Tutup Modal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </KasirLayout>
    );
}