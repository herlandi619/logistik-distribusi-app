import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import KasirLayout from '@/Layouts/KasirLayout';

export default function Index({ stockOuts, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [previewData, setPreviewData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Helper untuk format rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(number || 0);
    };

    // Handle Live / Submit Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/kasir/cetak-nota', { search }, { preserveState: true, replace: true });
    };

    // Buka Modal Preview Detail
    const handleOpenPreview = (item) => {
        setPreviewData(item);
        setModalOpen(true);
    };

    // Trigger Print PDF ke Tab Baru
    const handleCetakPdf = (id, noSj) => {
        Swal.fire({
            title: 'Cetak Surat Jalan?',
            text: `Sistem akan membuka dokumen PDF untuk Surat Jalan ${noSj}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Cetak PDF',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                window.open(`/kasir/cetak-nota/${id}/pdf`, '_blank');
            }
        });
    };

    return (
        <KasirLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header Page */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cetak Surat Jalan & Nota</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Pilih transaksi distribusi untuk mencetak dokumen surat jalan resmi dan nota pengiriman.
                        </p>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Header Filter & Search */}
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-base font-bold text-gray-800">Daftar Surat Jalan Siap Cetak</h2>
                        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
                            <div className="relative w-full sm:w-72">
                                <input
                                    type="text"
                                    placeholder="Cari No. SJ, Pelanggan, Barang..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                />
                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs font-semibold text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">No. Surat Jalan</th>
                                    <th className="px-6 py-4">Tanggal Pengiriman</th>
                                    <th className="px-6 py-4">Tujuan Pelanggan</th>
                                    <th className="px-6 py-4">Barang & Qty</th>
                                    <th className="px-6 py-4 text-right">Harga Satuan</th>
                                    <th className="px-6 py-4 text-right">Total Harga</th>
                                    <th className="px-6 py-4 text-center">Aksi Dokumen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stockOuts.data.length > 0 ? (
                                    stockOuts.data.map((item) => {
                                        const hargaSatuan = item.item?.harga_jual || 0;
                                        const totalHarga = item.jumlah_keluar * hargaSatuan;

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
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        Jumlah: {item.jumlah_keluar} {item.item?.satuan}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-600">
                                                    {formatRupiah(hargaSatuan)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                    {formatRupiah(totalHarga)}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                                                    <button
                                                        onClick={() => handleOpenPreview(item)}
                                                        className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Detail
                                                    </button>
                                                    <button
                                                        onClick={() => handleCetakPdf(item.id, item.no_surat_jalan)}
                                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-sm transition active:scale-95"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                        </svg>
                                                        Cetak PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-gray-400">
                                            Tidak ada data surat jalan yang ditemukan.
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

                {/* MODAL BOX DETAIL PREVIEW SURAT JALAN */}
                {modalOpen && previewData && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-100">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Preview Surat Jalan</h3>
                                    <p className="text-xs text-gray-500">Ringkasan data sebelum mengunduh PDF.</p>
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
                                        <span className="font-mono font-bold text-blue-700">{previewData.no_surat_jalan}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tanggal Pengiriman:</span>
                                        <span className="font-semibold">{previewData.tanggal_keluar}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Petugas Kasir:</span>
                                        <span className="font-semibold">{previewData.user?.name || '-'}</span>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-3 space-y-1">
                                    <div className="font-bold text-gray-800 mb-1">Tujuan Pengiriman</div>
                                    <div><b>Nama:</b> {previewData.customer?.nama_customer}</div>
                                    <div><b>Alamat:</b> {previewData.customer?.alamat}</div>
                                    <div><b>Kontak:</b> {previewData.customer?.kontak}</div>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-3 space-y-2">
                                    <div className="font-bold text-gray-800 border-b border-gray-100 pb-1">Detail Transaksi</div>
                                    <div className="flex justify-between">
                                        <span><b>Barang:</b> {previewData.item?.nama_barang} ({previewData.item?.kode_barang})</span>
                                        <span className="font-bold text-gray-800">{previewData.jumlah_keluar} {previewData.item?.satuan}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Harga Satuan:</span>
                                        <span>{formatRupiah(previewData.item?.harga_jual)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-sm text-blue-700 border-t border-gray-100 pt-1.5">
                                        <span>Total Tagihan:</span>
                                        <span>{formatRupiah(previewData.jumlah_keluar * (previewData.item?.harga_jual || 0))}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Footer */}
                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={() => {
                                        setModalOpen(false);
                                        handleCetakPdf(previewData.id, previewData.no_surat_jalan);
                                    }}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Cetak Dokumen PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </KasirLayout>
    );
}