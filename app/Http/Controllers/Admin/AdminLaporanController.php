<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockIn;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;


class AdminLaporanController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $search = $request->input('search');

        // Pastikan format tanggal valid
        $formattedStart = $startDate ? Carbon::parse($startDate)->startOfDay()->toDateTimeString() : null;
        $formattedEnd = $endDate ? Carbon::parse($endDate)->endOfDay()->toDateTimeString() : null;

        $query = Item::query()
            ->select('items.id', 'items.kode_barang', 'items.nama_barang', 'items.kategori', 'items.satuan', 'items.stok')
            ->selectSub(function ($q) use ($formattedStart, $formattedEnd) {
                $q->from('stock_ins')
                  ->selectRaw('COALESCE(SUM(jumlah_masuk), 0)')
                  ->whereColumn('stock_ins.item_id', 'items.id')
                  ->when($formattedStart, fn($sub) => $sub->where('tanggal_masuk', '>=', $formattedStart))
                  ->when($formattedEnd, fn($sub) => $sub->where('tanggal_masuk', '<=', $formattedEnd));
            }, 'total_masuk')
            ->selectSub(function ($q) use ($formattedStart, $formattedEnd) {
                $q->from('stock_outs')
                  ->selectRaw('COALESCE(SUM(jumlah_keluar), 0)')
                  ->whereColumn('stock_outs.item_id', 'items.id')
                  ->when($formattedStart, fn($sub) => $sub->where('tanggal_keluar', '>=', $formattedStart))
                  ->when($formattedEnd, fn($sub) => $sub->where('tanggal_keluar', '<=', $formattedEnd));
            }, 'total_keluar');

        // Filter berdasarkan kata kunci nama/kode/kategori
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('kode_barang', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%");
            });
        }

        // JIKA TANGGAL DIISI: Hanya tampilkan barang yang benar-benar ada transaksi masuk/keluar di rentang tanggal tersebut
        if ($startDate || $endDate) {
            $query->where(function ($q) use ($formattedStart, $formattedEnd) {
                $q->whereExists(function ($sub) use ($formattedStart, $formattedEnd) {
                    $sub->select('id')->from('stock_ins')
                        ->whereColumn('stock_ins.item_id', 'items.id')
                        ->when($formattedStart, fn($s) => $s->where('tanggal_masuk', '>=', $formattedStart))
                        ->when($formattedEnd, fn($s) => $s->where('tanggal_masuk', '<=', $formattedEnd));
                })->orWhereExists(function ($sub) use ($formattedStart, $formattedEnd) {
                    $sub->select('id')->from('stock_outs')
                        ->whereColumn('stock_outs.item_id', 'items.id')
                        ->when($formattedStart, fn($s) => $s->where('tanggal_keluar', '>=', $formattedStart))
                        ->when($formattedEnd, fn($s) => $s->where('tanggal_keluar', '<=', $formattedEnd));
                });
            });
        }

        $laporanData = $query->latest('items.created_at')
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Admin/Laporan/Index', [
            'laporanData' => $laporanData,
            'filters' => [
                'start_date' => $startDate ?? '',
                'end_date' => $endDate ?? '',
                'search' => $search ?? '',
            ]
        ]);
    }

    public function exportPdf()
    {
        // Ambil data dari database beserta relasinya
        $stockIns = StockIn::with(['item', 'supplier', 'user'])->get();

        // Load view blade khusus untuk PDF
        $pdf = Pdf::loadView('exports.stock-in-pdf', [
            'stockIns' => $stockIns
        ]);

        // Atur ukuran kertas dan orientasi (opsional)
        $pdf->setPaper('a4', 'portrait');

        // Unduh file PDF secara langsung
        return $pdf->download('laporan-stock-masuk.pdf');
        
        // Atau jika ingin langsung menampilkannya di browser:
        // return $pdf->stream('laporan-stock-masuk.pdf');
    }
}