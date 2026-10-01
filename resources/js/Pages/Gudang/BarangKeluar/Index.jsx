import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import GudangLayout from '@/Layouts/GudangLayout';
import Swal from 'sweetalert2';

export default function Index({ stockOuts, items, customers, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Hook Inertia untuk Transaksi Barang Keluar
    const { data, setData, post, processing, errors, reset } = useForm({
        no_surat_jalan: '',
        item_id: '',
        customer_id: '',
        jumlah_keluar: 1,
        tanggal_keluar: new Date().toISOString().split('T')[0],
    });

    // Otomatis generate nomor surat jalan sederhana saat modal dibuka
    const generateSuratJalan = () => {
        const timestamp = Date.now().toString().slice(-6);
        return `SJ-OUT-${timestamp}`;
    };

    // Open Modal Handlers
    const openModal = () => {
        reset();
        setData('no_surat_jalan', generateSuratJalan());
        setIsModalOpen(true);
    };

    // Handle Search Filter
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('gudang.barang-keluar.index'),
            { search: searchQuery },
            { preserveState: true }
        );
    };

    // Submit Transaksi Barang Keluar
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi frontend sederhana untuk sisa stok
        const selectedItem = items.find((i) => i.id === parseInt(data.item_id));
        if (selectedItem && selectedItem.stok < parseInt(data.jumlah_keluar)) {
            Swal.fire({
                icon: 'error',
                title: 'Stok Tidak Mencukupi!',
                text: `Stok fisik ${selectedItem.nama_barang} hanya tersisa ${selectedItem.stok} ${selectedItem.satuan}.`,
            });
            return;
        }

        post(route('gudang.barang-keluar.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Transaksi barang keluar berhasil dicatat dan stok fisik berkurang.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
            onError: (err) => {
                if (err.jumlah_keluar) {
                    Swal.fire('Gagal!', err.jumlah_keluar, 'error');
                }
            },
        });
    };

    // Hapus / Pembatalan Transaksi
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Membatalkan Transaksi Barang Keluar?',
            text: 'Data transaksi akan dihapus dan jumlah stok akan dikembalikan ke gudang!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, batalkan!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('gudang.barang-keluar.destroy', id), {
                    onSuccess: () => {
                        Swal.fire(
                            'Dibatalkan!',
                            'Transaksi berhasil dibatalkan dan stok dikembalikan.',
                            'success'
                        );
                    },
                });
            }
        });
    };

    return (
        <GudangLayout title="Transaksi Barang Keluar (Goods Issue)">
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Pencatatan Barang Keluar (Goods Issue)
                        </h1>
                        <p className="text-sm text-gray-600">
                            Kelola pengeluaran barang dari gudang untuk distribusi ke toko atau pelanggan.
                        </p>
                    </div>
                    <button
                        onClick={openModal}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
                    >
                        <span>-</span> Catat Barang Keluar
                    </button>
                </div>

                {/* Main Content Box */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    {/* Search Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Cari No. Surat Jalan, Barang, Customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-80 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Table Stock Outs */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                                    <th className="p-3">No. Surat Jalan</th>
                                    <th className="p-3">Tanggal Keluar</th>
                                    <th className="p-3">Kode Barang</th>
                                    <th className="p-3">Nama Barang</th>
                                    <th className="p-3">Tujuan (Customer)</th>
                                    <th className="p-3">Jumlah Keluar</th>
                                    <th className="p-3">Petugas (Input)</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {stockOuts.data.length > 0 ? (
                                    stockOuts.data.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            <td className="p-3 font-semibold text-amber-700">
                                                {row.no_surat_jalan}
                                            </td>
                                            <td className="p-3 font-medium text-gray-700">{row.tanggal_keluar}</td>
                                            <td className="p-3 font-semibold text-gray-600">{row.item?.kode_barang}</td>
                                            <td className="p-3 font-medium">{row.item?.nama_barang}</td>
                                            <td className="p-3 text-gray-600">{row.customer?.nama_customer}</td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                                                    -{row.jumlah_keluar} {row.item?.satuan}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600">{row.user?.name || 'Petugas Gudang'}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
                                                >
                                                    Batalkan
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center p-4 text-gray-500">
                                            Belum ada transaksi barang keluar tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar (5 Data/Halaman) */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                            Menampilkan {stockOuts.from || 0} sampai {stockOuts.to || 0} dari {stockOuts.total} transaksi
                        </span>
                        <div className="flex gap-1">
                            {stockOuts.links.map((link, key) => (
                                <button
                                    key={key}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 border text-xs rounded transition ${
                                        link.active
                                            ? 'bg-amber-600 text-white border-amber-600 font-bold'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM: INPUT BARANG KELUAR */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            Form Input Barang Keluar
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* No Surat Jalan */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    No. Surat Jalan
                                </label>
                                <input
                                    type="text"
                                    value={data.no_surat_jalan}
                                    onChange={(e) => setData('no_surat_jalan', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    required
                                />
                                {errors.no_surat_jalan && (
                                    <span className="text-red-500 text-xs">{errors.no_surat_jalan}</span>
                                )}
                            </div>

                            {/* Select Barang */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Pilih Barang (Stok Fisik)
                                </label>
                                <select
                                    value={data.item_id}
                                    onChange={(e) => setData('item_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    required
                                >
                                    <option value="">-- Pilih Barang --</option>
                                    {items.map((i) => (
                                        <option key={i.id} value={i.id} disabled={i.stok <= 0}>
                                            {i.kode_barang} - {i.nama_barang} (Sisa Stok: {i.stok} {i.satuan}) {i.stok <= 0 ? '[HABIS]' : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.item_id && <span className="text-red-500 text-xs">{errors.item_id}</span>}
                            </div>

                            {/* Select Customer */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tujuan Distribusi (Customer)
                                </label>
                                <select
                                    value={data.customer_id}
                                    onChange={(e) => setData('customer_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    required
                                >
                                    <option value="">-- Pilih Customer --</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nama_customer}
                                        </option>
                                    ))}
                                </select>
                                {errors.customer_id && <span className="text-red-500 text-xs">{errors.customer_id}</span>}
                            </div>

                            {/* Jumlah Keluar */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Jumlah Barang Keluar
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.jumlah_keluar}
                                    onChange={(e) => setData('jumlah_keluar', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    required
                                />
                                {errors.jumlah_keluar && (
                                    <span className="text-red-500 text-xs">{errors.jumlah_keluar}</span>
                                )}
                            </div>

                            {/* Tanggal Keluar */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tanggal Keluar
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_keluar}
                                    onChange={(e) => setData('tanggal_keluar', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    required
                                />
                                {errors.tanggal_keluar && (
                                    <span className="text-red-500 text-xs">{errors.tanggal_keluar}</span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition font-medium"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Barang Keluar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GudangLayout>
    );
}