import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    FileText, 
    LogOut, 
    Menu, 
    X, 
    Bell, 
    Package,
    Handshake,
    ChevronDown 
} from 'lucide-react';

export default function AdminLayout({ header, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // Daftar menu navigasi sidebar
    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manajemen User', href: '/admin/users', icon: Users },
        { name: 'Master Data', href: '/admin/items', icon: Package },
        { name: 'Mitra', href: '/admin/mitra', icon: Handshake },
        { name: 'Laporan', href: '/admin/laporan', icon: FileText },
    ];
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Backdrop untuk mobile saat sidebar terbuka */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo / Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <span className="text-xl font-bold text-gray-800">AdminPanel</span>
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigasi Link */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item, index) => {
                        const Icon = item.icon;
                        // Anda bisa sesuaikan kondisi 'active' berdasarkan route saat ini
                        const isActive = window.location.pathname === item.href;

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors
                                    ${isActive 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (Logout / Info akun bawah) */}
                <div className="p-4 border-t border-gray-100">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Wrapper Utama */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {header && (
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                                {header}
                            </h1>
                        )}
                    </div>

                    {/* Bagian Kanan Topbar (Notifikasi & Profil) */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
                            >
                                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <span className="hidden md:block text-sm font-medium text-gray-700 text-left">
                                    {auth?.user?.name || 'Administrator'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                            </button>

                            {/* Dropdown Profil */}
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                                        <p className="text-sm font-medium text-gray-800">{auth?.user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{auth?.user?.email}</p>
                                    </div>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profil Saya
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}