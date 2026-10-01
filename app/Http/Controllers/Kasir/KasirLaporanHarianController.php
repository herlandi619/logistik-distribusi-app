<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class KasirLaporanHarianController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $startDate = $request->input('start_date', date('Y-m-d'));
        $endDate = $request->input('end_date', date('Y-m-d'));

        // Query dasar transaksi barang keluar
        $query = StockOut::with(['item', 'customer', 'user'])
            ->whereBetween('tanggal_keluar', [$startDate, $endDate])
            ->when($search, function ($q, $search) {
                $q->where('no_surat_jalan', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($c) use ($search) {
                      $c->where('nama_customer', 'like', "%{$search}%");
                  })
                  ->orWhereHas('item', function ($i) use ($search) {
                      $i->where('nama_barang', 'like', "%{$search}%");
                  });
            });

        // Paginasi Data Transaksi
        $stockOuts = (clone $query)
            ->latest('tanggal_keluar')
            ->latest('id')
            ->paginate(5)
            ->withQueryString();

        // Rekapitulasi Statistik Periode Terpilih
        $totalTransaksi = (clone $query)->count();
        $totalQtyBarang = (clone $query)->sum('jumlah_keluar');
        
        // Menghitung Estimasi Total Omset (Jumlah * Harga Jual Barang)
        $totalNilaiOmset = (clone $query)->get()->sum(function ($item) {
            return $item->jumlah_keluar * ($item->item->harga_jual ?? 0);
        });

        return Inertia::render('Kasir/LaporanHarian/Index', [
            'stockOuts' => $stockOuts,
            'summary' => [
                'total_transaksi' => $totalTransaksi,
                'total_qty' => $totalQtyBarang,
                'total_omset' => $totalNilaiOmset,
            ],
            'filters' => [
                'search' => $search,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }


    public function cetakPdf(Request $request)
    {
        $startDate = $request->input('start_date', date('Y-m-d'));
        $endDate = $request->input('end_date', date('Y-m-d'));

        // Ambil SELURUH data tanpa paginasi untuk rekapitulasi
        $stockOuts = StockOut::with(['item', 'customer', 'user'])
            ->whereBetween('tanggal_keluar', [$startDate, $endDate])
            ->latest('tanggal_keluar')
            ->get();

        $totalOmset = $stockOuts->sum(function ($item) {
            return $item->jumlah_keluar * ($item->item->harga_jual ?? 0);
        });

        $pdf = Pdf::loadView('pdf.laporan_rekap', compact('stockOuts', 'startDate', 'endDate', 'totalOmset'))
                ->setPaper('a4', 'landscape');

        return $pdf->stream("Laporan_Penjualan_{$startDate}_s_d_{$endDate}.pdf");
    }
}