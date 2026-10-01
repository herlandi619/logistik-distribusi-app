import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import GudangLayout from '@/Layouts/GudangLayout';
import Swal from 'sweetalert2';

export default function Index({ items, stats, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Form Hook Inertia untuk pengubahan stok minimum
    const { data, setData, put, processing, errors, reset } = useForm({
        stok_minimum: 0,
    });

    // Peringatan otomatis SweetAlert2 saat halaman dimuat jika ada stok kritis
    useEffect(() => {
        if (stats.warning_count > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan Stok Gudang!',
                text: `Terdapat ${stats.warning_count} barang dengan stok di bawah atau mencapai batas minimum!`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Periksa Stok'
            });
        }
    }, []);

    // Handling Filter Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('gudang.dashboard'),
            { search: searchQuery },
            { preserveState: true }
        );
    };

    // Buka Modal Edit Stok Minimum
    const openEditModal = (item) => {
        setSelectedItem(item);
        setData('stok_minimum', item.stok_minimum);
        setIsModalOpen(true);
    };

    // Submit Form Edit Stok Minimum
    const handleSubmitMinimum = (e) => {
        e.preventDefault();
        put(route('gudang.items.update-minimum', selectedItem.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Batas stok minimum berhasil diperbarui.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
        });
    };

    return (
        <GudangLayout title="Dashboard Gudang & Monitoring Stok">
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Monitoring Stok Gudang (Real-Time)
                    </h1>
                    <p className="text-sm text-gray-600">
                        Pemantauan keluar-masuk barang dan peringatan batas minimum stok CV. Elang Jaya Prima.
                    </p>
                </div>

                {/* Kartu Ringkasan Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Total Jenis Barang</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.total_items}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            📦
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Stok Aman</p>
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.safe_count}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            ✅
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Stok Menipis (Peringatan)</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">{stats.warning_count}</h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            ⚠️
                        </div>
                    </div>
                </div>

                {/* Tabel Monitoring Stok */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    {/* Search Bar Form */}
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Cari Kode, Nama Barang, atau Kategori..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-80 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                                    <th className="p-3">Kode Barang</th>
                                    <th className="p-3">Nama Barang</th>
                                    <th className="p-3">Kategori</th>
                                    <th className="p-3">Stok Saat Ini</th>
                                    <th className="p-3">Stok Minimum</th>
                                    <th className="p-3">Satuan</th>
                                    <th className="p-3">Status Stok</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {items.data.length > 0 ? (
                                    items.data.map((item) => {
                                        const isLowStock = item.stok <= item.stok_minimum;
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="p-3 font-semibold text-gray-700">{item.kode_barang}</td>
                                                <td className="p-3">{item.nama_barang}</td>
                                                <td className="p-3 text-gray-600">{item.kategori}</td>
                                                <td className="p-3 font-bold text-base">
                                                    {item.stok}
                                                </td>
                                                <td className="p-3 text-gray-600">{item.stok_minimum}</td>
                                                <td className="p-3">{item.satuan}</td>
                                                <td className="p-3">
                                                    {isLowStock ? (
                                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                            ⚠️ Menipis
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                            ✅ Aman
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition"
                                                    >
                                                        Set Min Stok
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center p-4 text-gray-500">
                                            Data barang tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar (5 Data/Halaman) */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                            Menampilkan {items.from || 0} sampai {items.to || 0} dari {items.total} barang
                        </span>
                        <div className="flex gap-1">
                            {items.links.map((link, key) => (
                                <button
                                    key={key}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 border text-xs rounded transition ${
                                        link.active
                                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL BOX: EDIT STOK MINIMUM */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">
                            Atur Batas Minimum Stok
                        </h2>
                        <p className="text-xs text-gray-500 mb-4">
                            Barang: <span className="font-semibold text-gray-700">{selectedItem.nama_barang}</span> ({selectedItem.kode_barang})
                        </p>

                        <form onSubmit={handleSubmitMinimum} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Stok Minimum Baru
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stok_minimum}
                                    onChange={(e) => setData('stok_minimum', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                {errors.stok_minimum && (
                                    <span className="text-red-500 text-xs">{errors.stok_minimum}</span>
                                )}
                            </div>

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
                                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GudangLayout>
    );
}