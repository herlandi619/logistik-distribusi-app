<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GudangGoodsReceiptController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Fetch riwayat barang masuk dengan relasi item, supplier, dan user (petugas)
        $stockIns = StockIn::with(['item', 'supplier', 'user'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('item', function ($q) use ($search) {
                    $q->where('nama_barang', 'like', "%{$search}%")
                      ->orWhere('kode_barang', 'like', "%{$search}%");
                })->orWhereHas('supplier', function ($q) use ($search) {
                    $q->where('nama_supplier', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Gudang/BarangMasuk/Index', [
            'stockIns' => $stockIns,
            'items' => Item::select('id', 'kode_barang', 'nama_barang', 'stok', 'satuan')->get(),
            'suppliers' => Supplier::select('id', 'nama_supplier')->get(),
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'jumlah_masuk' => 'required|integer|min:1',
            'tanggal_masuk' => 'required|date',
        ]);

        DB::transaction(function () use ($request) {
            // 1. INSERT data ke tabel stock_ins
            StockIn::create([
                'item_id' => $request->item_id,
                'supplier_id' => $request->supplier_id,
                'user_id' => Auth::id(),
                'jumlah_masuk' => $request->jumlah_masuk,
                'tanggal_masuk' => $request->tanggal_masuk,
            ]);

            // 2. UPDATE stok di tabel items (stok_baru = stok_lama + jumlah_masuk)
            $item = Item::findOrFail($request->item_id);
            $item->increment('stok', $request->jumlah_masuk);
        });

        return redirect()->back()->with('success', 'Transaksi barang masuk berhasil dicatat dan stok bertambah!');
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $stockIn = StockIn::findOrFail($id);

            // Periksa apakah stok mencukupi untuk dikurangi kembali (rollback)
            $item = Item::findOrFail($stockIn->item_id);
            if ($item->stok < $stockIn->jumlah_masuk) {
                throw new \Exception("Stok barang saat ini tidak mencukupi untuk membatalkan transaksi ini!");
            }

            // Kurangi stok di tabel items (rollback)
            $item->decrement('stok', $stockIn->jumlah_masuk);

            // Hapus data transaksi dari stock_ins
            $stockIn->delete();
        });

        return redirect()->back()->with('success', 'Transaksi barang masuk berhasil dibatalkan!');
    }
}