import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ suppliers, customers, filters }) {
    const [activeTab, setActiveTab] = useState(filters.active_tab || 'supplier');
    const isSupplier = activeTab === 'supplier';
    const currentData = isSupplier ? suppliers : customers;
    const titleLabel = isSupplier ? 'Supplier' : 'Customer';

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        id: '',
        nama: '',
        kontak: '',
        alamat: '',
    });

    const [modal, setModal] = useState({ show: false, edit: false });
    const [search, setSearch] = useState(
        isSupplier ? filters.search_supplier : filters.search_customer
    );

    // Beralih Tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const searchVal = tab === 'supplier' ? filters.search_supplier : filters.search_customer;
        setSearch(searchVal);
    };

    // Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        const searchParam = isSupplier ? { search_supplier: search } : { search_customer: search };
        router.get(route('admin.mitra.index'), { ...searchParam, tab: activeTab }, { preserveState: true });
    };

    const openCreateModal = () => {
        reset();
        setModal({ show: true, edit: false });
    };

    const openEditModal = (item) => {
        setData({
            id: item.id,
            nama: isSupplier ? item.nama_supplier : item.nama_customer,
            kontak: item.kontak,
            alamat: item.alamat || '',
        });
        setModal({ show: true, edit: true });
    };

    const closeModal = () => {
        setModal({ show: false, edit: false });
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (modal.edit) {
            put(route('admin.mitra.update', [activeTab, data.id]), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Berhasil!', `Data ${titleLabel} diperbarui.`, 'success');
                }
            });
        } else {
            post(route('admin.mitra.store', activeTab), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Berhasil!', `Data ${titleLabel} ditambahkan.`, 'success');
                }
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data ${titleLabel} ini akan dihapus!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.mitra.destroy', [activeTab, id]), {
                    onSuccess: () => Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success')
                });
            }
        });
    };

    return (
        <AdminLayout header="Master Data Mitra Bisnis">
            <div className="p-6">
                {/* Switcher Tab Supplier / Customer */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => handleTabChange('supplier')}
                        className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors ${
                            isSupplier
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Data Supplier
                    </button>
                    <button
                        onClick={() => handleTabChange('customer')}
                        className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors ${
                            !isSupplier
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Data Customer
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <button
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                    >
                        + Tambah {titleLabel}
                    </button>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Cari ${titleLabel.toLowerCase()}...`}
                            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm">
                            Cari
                        </button>
                    </form>
                </div>

                {/* Tabel Data */}
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="p-4 border-b">No</th>
                                <th className="p-4 border-b">Nama {titleLabel}</th>
                                <th className="p-4 border-b">Kontak</th>
                                <th className="p-4 border-b">Alamat</th>
                                <th className="p-4 border-b text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {currentData.data.length > 0 ? (
                                currentData.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-500">{currentData.from + index}</td>
                                        <td className="p-4 font-semibold text-gray-800">
                                            {isSupplier ? item.nama_supplier : item.nama_customer}
                                        </td>
                                        <td className="p-4 text-gray-600">{item.kontak}</td>
                                        <td className="p-4 text-gray-600">{item.alamat}</td>
                                        <td className="p-4 text-center space-x-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">
                                        Data {titleLabel.toLowerCase()} tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex gap-1 justify-end">
                    {currentData.links.map((link, i) => {
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

            {/* Modal Box Form */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">
                            {modal.edit ? `Edit ${titleLabel}` : `Tambah ${titleLabel}`}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Nama {titleLabel}</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    required
                                />
                                {errors.nama && <span className="text-xs text-rose-500">{errors.nama}</span>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Kontak</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    value={data.kontak}
                                    onChange={(e) => setData('kontak', e.target.value)}
                                    required
                                />
                                {errors.kontak && <span className="text-xs text-rose-500">{errors.kontak}</span>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Alamat</label>
                                <textarea
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    rows="3"
                                    required
                                ></textarea>
                                {errors.alamat && <span className="text-xs text-rose-500">{errors.alamat}</span>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-200 px-4 py-2 rounded-xl text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm"
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