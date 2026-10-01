<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'kode_barang' => 'BRG-001',
                'nama_barang' => 'Tepung Terigu Premium 1kg',
                'kategori' => 'Bahan Pokok',
                'stok' => 150,
                'stok_minimum' => 10,
                'satuan' => 'Pcs',
                'harga_jual' => 13500,
            ],
            [
                'kode_barang' => 'BRG-002',
                'nama_barang' => 'Minyak Goreng 2 Liter',
                'kategori' => 'Bahan Pokok',
                'stok' => 80,
                'stok_minimum' => 15,
                'satuan' => 'Pouch',
                'harga_jual' => 34000,
            ],
            [
                'kode_barang' => 'BRG-003',
                'nama_barang' => 'Gula Pasir Putih 1kg',
                'kategori' => 'Bahan Pokok',
                'stok' => 120,
                'stok_minimum' => 10,
                'satuan' => 'Kg',
                'harga_jual' => 16000,
            ],
            [
                'kode_barang' => 'BRG-004',
                'nama_barang' => 'Kopi Bubuk Hitam 200gr',
                'kategori' => 'Minuman',
                'stok' => 50,
                'stok_minimum' => 5,
                'satuan' => 'Pcs',
                'harga_jual' => 12500,
            ],
        ];

        foreach ($items as $item) {
            Item::create($item);
        }
    }
}
