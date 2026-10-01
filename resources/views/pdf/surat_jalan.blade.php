<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan - {{ $stockOut->no_surat_jalan }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h2 { margin: 0; }
        .header p { margin: 2px 0 0 0; font-size: 11px; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 4px 0; vertical-align: top; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .footer-table { width: 100%; text-align: center; margin-top: 40px; }
        .footer-table td { height: 60px; vertical-align: bottom; }
    </style>
</head>
<body>
    <div class="header">
        <h2>CV. ELANG JAYA PRIMA</h2>
        <p>Jl. Raya Serpong, Tangerang Selatan | Telp: (021) 555-0192</p>
        <h3 style="margin-top: 15px; text-decoration: underline;">SURAT JALAN & NOTA PENGIRIMAN</h3>
    </div>

    <table class="info-table">
        <tr>
            <td width="15%"><strong>No. Surat Jalan</strong></td>
            <td width="35%">: {{ $stockOut->no_surat_jalan }}</td>
            <td width="15%"><strong>Tujuan / Pelanggan</strong></td>
            <td width="35%">: {{ $stockOut->customer->nama_customer }}</td>
        </tr>
        <tr>
            <td><strong>Tanggal</strong></td>
            <td>: {{ \Carbon\Carbon::parse($stockOut->tanggal_keluar)->format('d/m/Y') }}</td>
            <td><strong>Alamat Kirim</strong></td>
            <td>: {{ $stockOut->customer->alamat }}</td>
        </tr>
        <tr>
            <td><strong>Petugas Kasir</strong></td>
            <td>: {{ $stockOut->user->name }}</td>
            <td><strong>Kontak</strong></td>
            <td>: {{ $stockOut->customer->kontak }}</td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th width="5%" class="text-center">No</th>
                <th width="15%">Kode Barang</th>
                <th width="35%">Nama Barang</th>
                <th width="10%" class="text-center">Jumlah</th>
                <th width="15%" class="text-right">Harga Satuan</th>
                <th width="20%" class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @php
                $hargaSatuan = $stockOut->item->harga_jual ?? 0;
                $subtotal = $stockOut->jumlah_keluar * $hargaSatuan;
            @endphp
            <tr>
                <td class="text-center">1</td>
                <td>{{ $stockOut->item->kode_barang }}</td>
                <td>{{ $stockOut->item->nama_barang }}</td>
                <td class="text-center">{{ $stockOut->jumlah_keluar }} {{ $stockOut->item->satuan }}</td>
                <td class="text-right">Rp {{ number_format($hargaSatuan, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($subtotal, 0, ',', '.') }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" class="text-right" style="font-weight: bold; background-color: #f9f9f9;">Total Pembayaran</td>
                <td class="text-right" style="font-weight: bold; background-color: #f9f9f9;">
                    Rp {{ number_format($subtotal, 0, ',', '.') }}
                </td>
            </tr>
        </tfoot>
    </table>

    <table class="footer-table">
        <tr>
            <td width="33%">Penerima,<br><br><br><br>( ............................ )</td>
            <td width="33%">Pengemudi / Kurir,<br><br><br><br>( ............................ )</td>
            <td width="33%">Hormat Kami (Kasir),<br><br><br><br>( <u>{{ $stockOut->user->name }}</u> )</td>
        </tr>
    </table>
</body>
</html>