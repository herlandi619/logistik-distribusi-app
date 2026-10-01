import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ items, filters }) {
    const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
        id: '',
        kode_barang: '',
        nama_barang: '',
        kategori: '',
        stok: 0,
        stok_minimum: 5,
        satuan: '',
        harga_jual: ''
    });

    const [modal, setModal] = useState({ show: false, edit: false });
    const [search, setSearch] = useState(filters.search || '');

    // Fungsi Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.items.index'), { search }, { preserveState: true });
    };

    // Fungsi Submit (Simpan / Update)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (modal.edit) {
            put(route('admin.items.update', data.id), {
                onSuccess: () => {
                    setModal({ show: false, edit: false });
                    reset();
                    Swal.fire('Sukses!', 'Data barang berhasil diperbarui', 'success');
                }
            });
        } else {
            post(route('admin.items.store'), {
                onSuccess: () => {
                    setModal({ show: false, edit: false });
                    reset();
                    Swal.fire('Sukses!', 'Data barang berhasil ditambahkan', 'success');
                }
            });
        }
    };

    // Fungsi Hapus dengan SweetAlert2
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data barang yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.items.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Data barang berhasil dihapus.', 'success');
                    }
                });
            }
        });
    };

    const openCreateModal = () => {
        reset();
        setModal({ show: true, edit: false });
    };

    const openEditModal = (item) => {
        setData({
            id: item.id,
            kode_barang: item.kode_barang,
            nama_barang: item.nama_barang,
            kategori: item.kategori,
            stok: item.stok,
            stok_minimum: item.stok_minimum,
            satuan: item.satuan,
            harga_jual: item.harga_jual
        });
        setModal({ show: true, edit: true });
    };

    return (
        <AdminLayout header="Master Data Barang">
            <div className="p-6">
                {/* Tombol Tambah & Kolom Pencarian */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <button 
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow text-sm font-medium transition-colors"
                    >
                        + Tambah Barang
                    </button>

                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            placeholder="Cari kode/nama barang..." 
                            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64" 
                        />
                        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium">
                            Cari
                        </button>
                    </form>
                </div>

                {/* Tabel Data Barang */}
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="p-4 border-b">No</th>
                                <th className="p-4 border-b">Kode Barang</th>
                                <th className="p-4 border-b">Nama Barang</th>
                                <th className="p-4 border-b">Kategori</th>
                                <th className="p-4 border-b">Stok</th>
                                <th className="p-4 border-b">Satuan</th>
                                <th className="p-4 border-b">Harga Jual</th>
                                <th className="p-4 border-b text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {items.data.length > 0 ? (
                                items.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50">
                                        <td className="p-4 text-gray-500">{items.from + index}</td>
                                        <td className="p-4 font-semibold text-gray-800">{item.kode_barang}</td>
                                        <td className="p-4 text-gray-800">{item.nama_barang}</td>
                                        <td className="p-4 text-gray-600">{item.kategori}</td>
                                        <td className="p-4 font-medium">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                item.stlog <= item.stok_minimum 
                                                    ? 'bg-red-100 text-red-700' 
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {item.stok} {item.stok <= item.stok_minimum && '(Menipis)'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{item.satuan}</td>
                                        <td className="p-4 text-gray-700 font-medium">
                                            Rp {Number(item.harga_jual).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 text-center space-x-2">
                                            <button 
                                                onClick={() => openEditModal(item)} 
                                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)} 
                                                className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-6 text-center text-gray-500">Tidak ada data barang tersedia.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex flex-wrap gap-1 justify-end">
                    {items.links.map((link, i) => {
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
                                className={`px-3 py-1.5 border text-sm rounded-lg ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!cleanUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Modal Form Box (Create / Edit) */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {modal.edit ? 'Edit Data Barang' : 'Tambah Barang Baru'}
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    value={data.kode_barang} 
                                    onChange={e => setData('kode_barang', e.target.value)} 
                                    placeholder="Contoh: BRG-001" 
                                    required 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    value={data.nama_barang} 
                                    onChange={e => setData('nama_barang', e.target.value)} 
                                    placeholder="Masukkan nama barang" 
                                    required 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                        value={data.kategori} 
                                        onChange={e => setData('kategori', e.target.value)} 
                                        placeholder="Contoh: Elektronik" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                        value={data.satuan} 
                                        onChange={e => setData('satuan', e.target.value)} 
                                        placeholder="Contoh: Pcs / Unit" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                        value={data.stok} 
                                        onChange={e => setData('stok', e.target.value)} 
                                        min="0" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok Minimum</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                        value={data.stok_minimum} 
                                        onChange={e => setData('stok_minimum', e.target.value)} 
                                        min="0" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)</label>
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    value={data.harga_jual} 
                                    onChange={e => setData('harga_jual', e.target.value)} 
                                    placeholder="0" 
                                    min="0" 
                                    required 
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setModal({ show: false, edit: false })} 
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}