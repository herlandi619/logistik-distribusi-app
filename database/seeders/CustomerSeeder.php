<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'nama_customer' => 'Toko Sembako Berkah Illahi',
                'kontak' => '081311223344',
                'alamat' => 'Jl. Ir. H. Juanda No. 12, Ciputat, Tangerang Selatan',
            ],
            [
                'nama_customer' => 'Minimarket Mandiri Mart',
                'kontak' => '087899887766',
                'alamat' => 'Jl. BSD Raya Utama Blok F2, Pagedangan, Tangerang',
            ],
            [
                'nama_customer' => 'Warung Kelontong Bu Siti',
                'kontak' => '085233445566',
                'alamat' => 'Jl. Pamulang Raya No. 88, Pamulang, Tangerang Selatan',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
