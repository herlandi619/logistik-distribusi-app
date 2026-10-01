import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ users, filters }) {
    const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
        id: '', 
        name: '', 
        email: '', 
        role: 'gudang', 
        password: ''
    });
    
    const [modal, setModal] = useState({ show: false, edit: false });
    const [search, setSearch] = useState(filters.search || '');

    // Fungsi Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    // Handle Submit (Tambah / Edit)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (modal.edit) {
            put(route('admin.users.update', data.id), {
                onSuccess: () => { 
                    setModal({ show: false, edit: false }); 
                    reset(); 
                    Swal.fire('Sukses!', 'Data user berhasil diupdate', 'success'); 
                }
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => { 
                    setModal({ show: false, edit: false }); 
                    reset(); 
                    Swal.fire('Sukses!', 'Data user berhasil disimpan', 'success'); 
                }
            });
        }
    };

    // Handle Hapus dengan SweetAlert2
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data user yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.users.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Data user berhasil dihapus.', 'success');
                    }
                });
            }
        });
    };

    const openEditModal = (user) => {
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: ''
        });
        setModal({ show: true, edit: true });
    };

    const openCreateModal = () => {
        reset();
        setModal({ show: true, edit: false });
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Pengguna</h1>
                
                {/* Tombol Tambah & Search */}
                <div className="flex justify-between items-center mb-4">
                    <button 
                        onClick={openCreateModal} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium"
                    >
                        + Tambah User
                    </button>
                    
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            placeholder="Cari nama / email..." 
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm">
                            Cari
                        </button>
                    </form>
                </div>

                {/* Tabel Data */}
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="p-3 border-b">No</th>
                                <th className="p-3 border-b">Nama</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Role</th>
                                <th className="p-3 border-b text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-200">
                            {users.data.length > 0 ? (
                                users.data.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="p-3">{users.from + index}</td>
                                        <td className="p-3 font-medium text-gray-800">{user.name}</td>
                                        <td className="p-3 text-gray-600">{user.email}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'gudang' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center space-x-2">
                                            <button 
                                                onClick={() => openEditModal(user)} 
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">Tidak ada data pengguna ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex flex-wrap gap-1 justify-end">
                    {users.links.map((link, i) => {
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
                                className={`px-3 py-1 border text-sm rounded ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!cleanUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Modal Box Form (Create / Edit) */}
            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {modal.edit ? 'Edit User' : 'Tambah User Baru'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    placeholder="Masukkan nama lengkap" 
                                    required 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    placeholder="Masukkan email" 
                                    required 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Hak Akses</label>
                                <select 
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    value={data.role} 
                                    onChange={e => setData('role', e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="gudang">Gudang</option>
                                    <option value="kasir">Kasir</option>
                                </select>
                            </div>

                            {!modal.edit && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        onChange={e => setData('password', e.target.value)} 
                                        placeholder="Minimal 6 karakter" 
                                        required 
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setModal({ show: false, edit: false })} 
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
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