import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import GudangLayout from '@/Layouts/GudangLayout';
import Swal from 'sweetalert2';

export default function Index({ stockIns, items, suppliers, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Inertia Form Hook untuk Transaksi Barang Masuk
    const { data, setData, post, processing, errors, reset } = useForm({
        item_id: '',
        supplier_id: '',
        jumlah_masuk: 1,
        tanggal_masuk: new Date().toISOString().split('T')[0],
    });

    // Handle Pencarian Filter
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('gudang.barang-masuk.index'),
            { search: searchQuery },
            { preserveState: true }
        );
    };

    // Buka Modal Form Tambah
    const openModal = () => {
        reset();
        setIsModalOpen(true);
    };

    // Submit Form Transaksi Barang Masuk
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('gudang.barang-masuk.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Barang masuk berhasil dicatat dan stok otomatis bertambah.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
        });
    };

    // Hapus / Pembatalan Transaksi
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Membatalkan Transaksi?',
            text: "Data transaksi akan dihapus dan stok barang akan dikurangi kembali!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, batalkan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('gudang.barang-masuk.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Dibatalkan!', 'Transaksi berhasil dibatalkan dan stok telah disesuaikan.', 'success');
                    },
                    onError: (err) => {
                        Swal.fire('Gagal!', err.message || 'Gagal membatalkan transaksi.', 'error');
                    }
                });
            }
        });
    };

    return (
        <GudangLayout title="Transaksi Barang Masuk (Goods Receipt)">
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Pencatatan Barang Masuk (Goods Receipt)
                        </h1>
                        <p className="text-sm text-gray-600">
                            Kelola riwayat penerimaan barang dari supplier ke dalam gudang.
                        </p>
                    </div>
                    <button
                        onClick={openModal}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
                    >
                        <span>+</span> Catat Barang Masuk
                    </button>
                </div>

                {/* Table & Filter Box */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    {/* Search Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Cari Nama Barang, Kode, atau Supplier..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-80 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Table Data Stock Ins */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                                    <th className="p-3">Tanggal Masuk</th>
                                    <th className="p-3">Kode Barang</th>
                                    <th className="p-3">Nama Barang</th>
                                    <th className="p-3">Supplier</th>
                                    <th className="p-3">Jumlah Masuk</th>
                                    <th className="p-3">Petugas (Input)</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {stockIns.data.length > 0 ? (
                                    stockIns.data.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-700">{row.tanggal_masuk}</td>
                                            <td className="p-3 font-semibold text-gray-600">{row.item?.kode_barang}</td>
                                            <td className="p-3 font-medium">{row.item?.nama_barang}</td>
                                            <td className="p-3 text-gray-600">{row.supplier?.nama_supplier}</td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                                                    +{row.jumlah_masuk} {row.item?.satuan}
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
                                        <td colSpan="7" className="text-center p-4 text-gray-500">
                                            Belum ada transaksi barang masuk tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Link (5 Data/Halaman) */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                            Menampilkan {stockIns.from || 0} sampai {stockIns.to || 0} dari {stockIns.total} transaksi
                        </span>
                        <div className="flex gap-1">
                            {stockIns.links.map((link, key) => (
                                <button
                                    key={key}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 border text-xs rounded transition ${
                                        link.active
                                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM: INPUT BARANG MASUK */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            Form Input Barang Masuk
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Select Barang */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Pilih Barang
                                </label>
                                <select
                                    value={data.item_id}
                                    onChange={(e) => setData('item_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    required
                                >
                                    <option value="">-- Pilih Barang --</option>
                                    {items.map((i) => (
                                        <option key={i.id} value={i.id}>
                                            {i.kode_barang} - {i.nama_barang} (Stok Saat Ini: {i.stok} {i.satuan})
                                        </option>
                                    ))}
                                </select>
                                {errors.item_id && <span className="text-red-500 text-xs">{errors.item_id}</span>}
                            </div>

                            {/* Select Supplier */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Pilih Pemasok (Supplier)
                                </label>
                                <select
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    required
                                >
                                    <option value="">-- Pilih Supplier --</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nama_supplier}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplier_id && <span className="text-red-500 text-xs">{errors.supplier_id}</span>}
                            </div>

                            {/* Jumlah Masuk */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Jumlah Barang Masuk
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.jumlah_masuk}
                                    onChange={(e) => setData('jumlah_masuk', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    required
                                />
                                {errors.jumlah_masuk && <span className="text-red-500 text-xs">{errors.jumlah_masuk}</span>}
                            </div>

                            {/* Tanggal Masuk */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tanggal Masuk
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_masuk}
                                    onChange={(e) => setData('tanggal_masuk', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    required
                                />
                                {errors.tanggal_masuk && <span className="text-red-500 text-xs">{errors.tanggal_masuk}</span>}
                            </div>

                            {/* Tombol Aksi */}
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
                                    className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-medium"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Barang Masuk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GudangLayout>
    );
}