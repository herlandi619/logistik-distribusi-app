<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Item;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GudangGoodsIssueController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Fetch riwayat barang keluar dengan relasi item, customer, dan user
        $stockOuts = StockOut::with(['item', 'customer', 'user'])
            ->when($search, function ($query, $search) {
                return $query->where('no_surat_jalan', 'like', "%{$search}%")
                    ->orWhereHas('item', function ($q) use ($search) {
                        $q->where('nama_barang', 'like', "%{$search}%")
                          ->orWhere('kode_barang', 'like', "%{$search}%");
                    })
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('nama_customer', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Gudang/BarangKeluar/Index', [
            'stockOuts' => $stockOuts,
            'items' => Item::select('id', 'kode_barang', 'nama_barang', 'stok', 'satuan')->get(),
            'customers' => Customer::select('id', 'nama_customer')->get(),
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'no_surat_jalan' => 'required|string|unique:stock_outs,no_surat_jalan',
            'item_id' => 'required|exists:items,id',
            'customer_id' => 'required|exists:customers,id',
            'jumlah_keluar' => 'required|integer|min:1',
            'tanggal_keluar' => 'required|date',
        ]);

        $item = Item::findOrFail($request->item_id);

        // Validasi ketersediaan stok fisik
        if ($item->stok < $request->jumlah_keluar) {
            return redirect()->back()->withErrors([
                'jumlah_keluar' => "Stok tidak mencukupi! Stok saat ini: {$item->stok} {$item->satuan}."
            ]);
        }

        DB::transaction(function () use ($request, $item) {
            // 1. INSERT data ke tabel stock_outs
            StockOut::create([
                'no_surat_jalan' => $request->no_surat_jalan,
                'item_id' => $request->item_id,
                'customer_id' => $request->customer_id,
                'user_id' => Auth::id(),
                'jumlah_keluar' => $request->jumlah_keluar,
                'tanggal_keluar' => $request->tanggal_keluar,
            ]);

            // 2. UPDATE stok di tabel items (stok_baru = stok_lama - jumlah_keluar)
            $item->decrement('stok', $request->jumlah_keluar);
        });

        return redirect()->back()->with('success', 'Transaksi barang keluar berhasil dicatat dan stok berkurang!');
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $stockOut = StockOut::findOrFail($id);
            $item = Item::findOrFail($stockOut->item_id);

            // Kembalikan jumlah stok (rollback stok_baru = stok_lama + jumlah_keluar)
            $item->increment('stok', $stockOut->jumlah_keluar);

            // Hapus data transaksi barang keluar
            $stockOut->delete();
        });

        return redirect()->back()->with('success', 'Transaksi barang keluar berhasil dibatalkan dan stok dikembalikan!');
    }
}