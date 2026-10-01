<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockOut;
use App\Models\Item;
use App\Models\Customer;
use App\Models\User;
use Carbon\Carbon;

class StockOutSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan data referensi tersedia
        $item = Item::first();
        $customer = Customer::first();
        $user = User::where('role', 'kasir')->first() ?? User::first();

        if ($item && $customer && $user) {
            $stockOuts = [
                [
                    'no_surat_jalan' => 'SJ-2026-001',
                    'item_id' => $item->id,
                    'customer_id' => $customer->id,
                    'user_id' => $user->id,
                    'jumlah_keluar' => 10,
                    'tanggal_keluar' => Carbon::now()->subDays(3),
                ],
                [
                    'no_surat_jalan' => 'SJ-2026-002',
                    'item_id' => $item->id,
                    'customer_id' => $customer->id,
                    'user_id' => $user->id,
                    'jumlah_keluar' => 15,
                    'tanggal_keluar' => Carbon::now()->subDay(),
                ],
            ];

            foreach ($stockOuts as $data) {
                StockOut::create($data);
            }
        }
    }
}