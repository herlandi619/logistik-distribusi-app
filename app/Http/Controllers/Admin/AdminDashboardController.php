<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Statistik untuk Ringkasan
        $stats = [
            'total_items' => Item::count(),
            'total_stock_in' => StockIn::sum('jumlah_masuk'),
            'total_stock_out' => StockOut::sum('jumlah_keluar'),
        ];

        // Data barang dengan stok menipis (Low Stock)
        $lowStockItems = Item::query()
            ->whereColumn('stok', '<=', 'stok_minimum')
            ->when($search, function ($query, $search) {
                $query->where('nama_barang', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => $stats,
            'items' => $lowStockItems,
            'filters' => $request->only(['search']),
        ]);
    }
}