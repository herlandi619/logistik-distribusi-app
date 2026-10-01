<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Customer;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KasirDistribusiController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $stockOuts = StockOut::with(['item', 'customer', 'user'])
            ->when($search, function ($query, $search) {
                $query->where('no_surat_jalan', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q) use ($search) {
                          $q->where('nama_customer', 'like', "%{$search}%");
                      })
                      ->orWhereHas('item', function ($q) use ($search) {
                          $q->where('nama_barang', 'like', "%{$search}%");
                      });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Kasir/Distribusi/Index', [
            'stockOuts' => $stockOuts,
            'items' => Item::select('id', 'kode_barang', 'nama_barang', 'stok', 'satuan', 'harga_jual')->get(),
            'customers' => Customer::select('id', 'nama_customer', 'alamat', 'kontak')->get(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'no_surat_jalan' => 'required|unique:stock_outs,no_surat_jalan',
            'item_id' => 'required|exists:items,id',
            'customer_id' => 'required|exists:customers,id',
            'jumlah_keluar' => 'required|integer|min:1',
            'tanggal_keluar' => 'required|date',
        ], [
            'no_surat_jalan.required' => 'Nomor surat jalan wajib diisi.',
            'no_surat_jalan.unique' => 'Nomor surat jalan sudah digunakan.',
            'item_id.required' => 'Silakan pilih barang.',
            'customer_id.required' => 'Silakan pilih pelanggan.',
            'jumlah_keluar.required' => 'Jumlah barang keluar wajib diisi.',
            'jumlah_keluar.min' => 'Jumlah barang minimal 1.',
            'tanggal_keluar.required' => 'Tanggal keluar wajib diisi.',
        ]);

        $item = Item::findOrFail($request->item_id);

        if ($item->stok < $request->jumlah_keluar) {
            return redirect()->back()->withErrors([
                'jumlah_keluar' => "Stok tidak mencukupi! Stok {$item->nama_barang} saat ini tersisa {$item->stok} {$item->satuan}."
            ]);
        }

        DB::transaction(function () use ($request, $item) {
            // 1. Simpan Transaksi Barang Keluar
            StockOut::create([
                'no_surat_jalan' => $request->no_surat_jalan,
                'item_id' => $request->item_id,
                'customer_id' => $request->customer_id,
                'user_id' => auth()->id(),
                'jumlah_keluar' => $request->jumlah_keluar,
                'tanggal_keluar' => $request->tanggal_keluar,
            ]);

            // 2. Potong Stok Fisik di Tabel Items
            $item->decrement('stok', $request->jumlah_keluar);
        });

        return redirect()->back()->with('success', 'Transaksi distribusi berhasil disimpan dan stok telah diperbarui!');
    }
}