<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class KasirCetakNotaController extends Controller
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

        return Inertia::render('Kasir/CetakNota/Index', [
            'stockOuts' => $stockOuts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function cetakPdf(StockOut $stockOut)
    {
        // Load relasi tabel
        $stockOut->load(['item', 'customer', 'user']);

        // Generate Blade View to PDF
        $pdf = Pdf::loadView('pdf.surat_jalan', compact('stockOut'))
                  ->setPaper('a4', 'portrait');

        // Preview langsung di browser tab baru
        return $pdf->stream("Surat_Jalan_{$stockOut->no_surat_jalan}.pdf");
    }
}
