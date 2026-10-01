<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Penjualan Harian</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 8px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        .table th { background-color: #f2f2f2; font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h2>LAPORAN REKAPITULASI PENJUALAN HARIAN</h2>
        <p>Periode: <b>{{ $startDate }}</b> s/d <b>{{ $endDate }}</b></p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th>No. Surat Jalan</th>
                <th>Tanggal</th>
                <th>Pelanggan / Tujuan</th>
                <th>Nama Barang</th>
                <th class="text-center">Jumlah</th>
                <th class="text-right">Harga Satuan</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @forelse($stockOuts as $index => $row)
                @php
                    $subtotal = $row->jumlah_keluar * ($row->item->harga_jual ?? 0);
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $row->no_surat_jalan }}</td>
                    <td>{{ $row->tanggal_keluar }}</td>
                    <td>{{ $row->customer->nama_customer ?? '-' }}</td>
                    <td>{{ $row->item->nama_barang ?? '-' }}</td>
                    <td class="text-center">{{ $row->jumlah_keluar }} {{ $row->item->satuan ?? '' }}</td>
                    <td class="text-right">Rp {{ number_format($row->item->harga_jual ?? 0, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($subtotal, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colSpan="8" class="text-center">Tidak ada transaksi pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <th colSpan="7" class="text-right">Total Nilai Omset:</th>
                <th class="text-right">Rp {{ number_format($totalOmset, 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>
</body>
</html> 