<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminItemController;
use App\Http\Controllers\Admin\AdminLaporanController;
use App\Http\Controllers\Admin\AdminMitraController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Gudang\GudangDashboardController;
use App\Http\Controllers\Gudang\GudangGoodsIssueController;
use App\Http\Controllers\Gudang\GudangGoodsReceiptController;
use App\Http\Controllers\Kasir\KasirCetakNotaController;
use App\Http\Controllers\Kasir\KasirDistribusiController;
use App\Http\Controllers\Kasir\KasirLaporanHarianController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// ADMIN
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // DASHBOARD
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // USER MANAGEMENT
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    // Master Data Barang
    Route::get('/items', [AdminItemController::class, 'index'])->name('items.index');
    Route::post('/items', [AdminItemController::class, 'store'])->name('items.store');
    Route::put('/items/{item}', [AdminItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [AdminItemController::class, 'destroy'])->name('items.destroy');

    // MITRA
    // Single GET Route tanpa {tipe}
    Route::get('/mitra', [AdminMitraController::class, 'index'])->name('mitra.index');

    // Route penanganan CRUD tetap dibedakan lewat POST, PUT, DELETE
    Route::post('/mitra/{tipe}', [AdminMitraController::class, 'store'])->name('mitra.store');
    Route::put('/mitra/{tipe}/{id}', [AdminMitraController::class, 'update'])->name('mitra.update');
    Route::delete('/mitra/{tipe}/{id}', [AdminMitraController::class, 'destroy'])->name('mitra.destroy');

    // Single GET Route Laporan Keseluruhan
    Route::get('/laporan', [AdminLaporanController::class, 'index'])->name('laporan.index');
    
});


// GUDANG
Route::middleware(['auth'])->prefix('gudang')->name('gudang.')->group(function () {
    // 1.DASHBOARD
    // Monitoring Stok Gudang Dashboard
    Route::get('/dashboard', [GudangDashboardController::class, 'index'])->name('dashboard');

    // Update Batas Stok Minimum (Fitur Penyesuaian Minimum Stok oleh Gudang)
    Route::put('/items/{id}/stok-minimum', [GudangDashboardController::class, 'updateStokMinimum'])->name('items.update-minimum');

    
    // 2.Tampilan Utama Transaksi Barang Masuk
    Route::get('/barang-masuk', [GudangGoodsReceiptController::class, 'index'])->name('barang-masuk.index');

    // Simpan Transaksi Barang Masuk Baru (Create)
    Route::post('/barang-masuk', [GudangGoodsReceiptController::class, 'store'])->name('barang-masuk.store');

    // Hapus/Batal Transaksi Barang Masuk (Delete + Rollback Stok)
    Route::delete('/barang-masuk/{id}', [GudangGoodsReceiptController::class, 'destroy'])->name('barang-masuk.destroy');


    // 3.Tampilan Utama Transaksi Barang Keluar
    Route::get('/barang-keluar', [GudangGoodsIssueController::class, 'index'])->name('barang-keluar.index');

    // Simpan Transaksi Barang Keluar Baru (Create)
    Route::post('/barang-keluar', [GudangGoodsIssueController::class, 'store'])->name('barang-keluar.store');

    // Hapus/Batal Transaksi Barang Keluar (Delete + Rollback Stok)
    Route::delete('/barang-keluar/{id}', [GudangGoodsIssueController::class, 'destroy'])->name('barang-keluar.destroy');

});


Route::middleware(['auth'])->prefix('kasir')->name('kasir.')->group(function () {
    // 1.Single Page View Utama Transaksi Distribusi Kasir
    Route::get('/distribusi', [KasirDistribusiController::class, 'index'])->name('distribusi.index');

    // Transaksi Distribusi / Barang Keluar
    Route::post('/distribusi', [KasirDistribusiController::class, 'store'])->name('distribusi.store');


    // 2.Single Page View Utama Cetak Surat Jalan / Nota
    Route::get('/cetak-nota', [KasirCetakNotaController::class, 'index'])->name('cetak-nota.index');

    // Route Download / Stream PDF Surat Jalan
    Route::get('/cetak-nota/{stockOut}/pdf', [KasirCetakNotaController::class, 'cetakPdf'])->name('cetak-nota.pdf');

    // 3.Single Page View Laporan Penjualan Harian
    Route::get('/laporan-harian', [KasirLaporanHarianController::class, 'index'])->name('laporan-harian.index');

    Route::get('/laporan-harian/pdf', [KasirLaporanHarianController::class, 'cetakPdf'])->name('laporan-harian.pdf');

});

require __DIR__.'/auth.php';
