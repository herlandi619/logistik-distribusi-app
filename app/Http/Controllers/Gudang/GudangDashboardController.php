<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GudangDashboardController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Query dasar barang dengan filter pencarian
        $query = Item::when($search, function ($q, $search) {
            return $q->where('nama_barang', 'like', "%{$search}%")
                     ->orWhere('kode_barang', 'like', "%{$search}%")
                     ->orWhere('kategori', 'like', "%{$search}%");
        });

        // Hitung statistik stok gudang
        $totalItems = Item::count();
        $warningItemsCount = Item::whereColumn('stok', '<=', 'stok_minimum')->count();
        $safeItemsCount = Item::whereColumn('stok', '>', 'stok_minimum')->count();

        // Paginate 5 data per halaman
        $items = $query->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Gudang/Dashboard/Index', [
            'items' => $items,
            'stats' => [
                'total_items' => $totalItems,
                'warning_count' => $warningItemsCount,
                'safe_count' => $safeItemsCount,
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function updateStokMinimum(Request $request, $id)
    {
        $request->validate([
            'stok_minimum' => 'required|integer|min:0',
        ]);

        $item = Item::findOrFail($id);
        $item->update([
            'stok_minimum' => $request->stok_minimum,
        ]);

        return redirect()->back()->with('success', 'Batas stok minimum berhasil diperbarui!');
    }
}
