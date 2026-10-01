<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'nama_supplier' => 'PT. Pangan Sentosa Jaya',
                'kontak' => '021-5550192',
                'alamat' => 'Jl. Industri Raya No. 45, Jakarta Utara',
            ],
            [
                'nama_supplier' => 'CV. Makmur Berkah Abadi',
                'kontak' => '081298765432',
                'alamat' => 'Kawasan Pergudangan Cikupa Blok A2, Tangerang',
            ],
            [
                'nama_supplier' => 'UD. Sumber Rezeki Pangan',
                'kontak' => '085712345678',
                'alamat' => 'Jl. Raya Serpong KM 7, Tangerang Selatan',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}
