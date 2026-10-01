import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import KasirLayout from '@/Layouts/KasirLayout';

export default function Index({ stockOuts, items, customers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);

    // Form Hook via Inertia
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        no_surat_jalan: '',
        item_id: '',
        customer_id: '',
        jumlah_keluar: 1,
        tanggal_keluar: new Date().toISOString().split('T')[0],
    });

    // Otomatis Generate Nomor Surat Jalan
    const handleOpenModal = () => {
        const autoNoSj = 'SJ-' + Date.now().toString().slice(-6);
        clearErrors();
        reset();
        setData({
            no_surat_jalan: autoNoSj,
            item_id: '',
            customer_id: '',
            jumlah_keluar: 1,
            tanggal_keluar: new Date().toISOString().split('T')[0],
        });
        setModalOpen(true);
    };

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/kasir/distribusi', { search }, { preserveState: true, replace: true });
    };

    // Detail Barang Terpilih
    const selectedItemInfo = items.find(i => i.id == data.item_id);
    const totalHargaEstimasi = selectedItemInfo ? selectedItemInfo.harga_jual * data.jumlah_keluar : 0;

    // Submit Transaksi Distribusi
    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedCustomer = customers.find(c => c.id == data.customer_id);

        if (selectedItemInfo && data.jumlah_keluar > selectedItemInfo.stok) {
            Swal.fire({
                icon: 'error',
                title: 'Stok Tidak Cukup!',
                text: `Stok ${selectedItemInfo.nama_barang} tersisa ${selectedItemInfo.stok} ${selectedItemInfo.satuan}.`,
                confirmButtonColor: '#ef4444',
            });
            return;
        }

        Swal.fire({
            title: 'Konfirmasi Transaksi',
            html: `
                <div class="text-left text-sm bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5">
                    <p><b>No. Surat Jalan:</b> <span class="text-blue-600 font-mono">${data.no_surat_jalan}</span></p>
                    <p><b>Pelanggan:</b> ${selectedCustomer?.nama_customer || '-'}</p>
                    <p><b>Barang:</b> ${selectedItemInfo?.nama_barang || '-'}</p>
                    <p><b>Jumlah:</b> ${data.jumlah_keluar} ${selectedItemInfo?.satuan || ''}</p>
                    <p class="pt-1 border-t text-gray-800"><b>Total Nilai:</b> <span class="text-emerald-600 font-bold">Rp ${Number(totalHargaEstimasi).toLocaleString('id-ID')}</span></p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Proses Distribusi',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                post('/kasir/distribusi', {
                    onSuccess: () => {
                        setModalOpen(false);
                        reset();
                        Swal.fire({
                            icon: 'success',
                            title: 'Transaksi Berhasil!',
                            text: 'Data telah disimpan dan stok telah diperbarui.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onError: (err) => {
                        if (err.jumlah_keluar) {
                            Swal.fire('Gagal!', err.jumlah_keluar, 'error');
                        }
                    }
                });
            }
        });
    };

    return (
        <KasirLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header & Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transaksi Distribusi</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola dan catat pengeluaran barang ke pelanggan secara real-time.</p>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Transaksi Baru</span>
                    </button>
                </div>

                {/* Ringkasan Dashboard / Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Total Transaksi Selesai</p>
                            <h3 className="text-xl font-bold text-gray-800">{stockOuts.total} Record</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Master Barang Ready</p>
                            <h3 className="text-xl font-bold text-gray-800">{items.length} Item</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Total Pelanggan Terdaftar</p>
                            <h3 className="text-xl font-bold text-gray-800">{customers.length} Mitra</h3>
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Filter & Search Header */}
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-base font-bold text-gray-800">Histori Pengeluaran Barang</h2>
                        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
                            <div className="relative w-full sm:w-72">
                                <input
                                    type="text"
                                    placeholder="Cari SJ, Pelanggan, atau Barang..."
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
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Pelanggan / Tujuan</th>
                                    <th className="px-6 py-4">Detail Barang</th>
                                    <th className="px-6 py-4 text-center">Jumlah Keluar</th>
                                    <th className="px-6 py-4">Petugas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stockOuts.data.length > 0 ? (
                                    stockOuts.data.map((item) => (
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
                                                <div className="text-xs font-mono text-gray-400">Kode: {item.item?.kode_barang || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 font-semibold px-3 py-1 rounded-full text-xs border border-red-100">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                    {item.jumlah_keluar} {item.item?.satuan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">{item.user?.name || 'Kasir'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-gray-400">
                                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            Tidak ada riwayat transaksi distribusi yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Custom Pagination Footer */}
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

                {/* MODAL FORM TRANSAKSI */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Transaksi Distribusi Baru</h3>
                                    <p className="text-xs text-gray-500">Isi detail form berikut untuk mencatat pengeluaran barang.</p>
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700">No. Surat Jalan</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mt-1 bg-gray-50 font-mono font-semibold text-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                            value={data.no_surat_jalan}
                                            onChange={e => setData('no_surat_jalan', e.target.value)}
                                            required
                                        />
                                        {errors.no_surat_jalan && <span className="text-xs text-red-500 mt-1">{errors.no_surat_jalan}</span>}
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-700">Tanggal Pengiriman</label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                            value={data.tanggal_keluar}
                                            onChange={e => setData('tanggal_keluar', e.target.value)}
                                            required
                                        />
                                        {errors.tanggal_keluar && <span className="text-xs text-red-500 mt-1">{errors.tanggal_keluar}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-700">Pilih Pelanggan / Mitra</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        value={data.customer_id}
                                        onChange={e => setData('customer_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Pelanggan --</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.nama_customer} ({c.alamat})</option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <span className="text-xs text-red-500 mt-1">{errors.customer_id}</span>}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-700">Pilih Barang</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        value={data.item_id}
                                        onChange={e => setData('item_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Barang --</option>
                                        {items.map(i => (
                                            <option key={i.id} value={i.id}>
                                                [{i.kode_barang}] {i.nama_barang} (Sisa: {i.stok} {i.satuan})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.item_id && <span className="text-xs text-red-500 mt-1">{errors.item_id}</span>}
                                </div>

                                {/* Dynamic Sub-total Box */}
                                {selectedItemInfo && (
                                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs space-y-1.5">
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Stok Tersedia:</span>
                                            <span className={`font-bold ${selectedItemInfo.stok < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                                                {selectedItemInfo.stok} {selectedItemInfo.satuan}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Harga Satuan:</span>
                                            <span className="font-semibold text-slate-800">Rp {Number(selectedItemInfo.harga_jual).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 text-sm font-bold text-gray-900">
                                            <span>Total Estimasi:</span>
                                            <span className="text-emerald-600">Rp {Number(totalHargaEstimasi).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-semibold text-gray-700">Jumlah Keluar</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        value={data.jumlah_keluar}
                                        onChange={e => setData('jumlah_keluar', e.target.value)}
                                        required
                                    />
                                    {errors.jumlah_keluar && <span className="text-xs text-red-500 mt-1">{errors.jumlah_keluar}</span>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </KasirLayout>
    );
}