<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockIn;
use App\Models\Item;
use App\Models\Supplier;
use App\Models\User;
use Carbon\Carbon;

class StockInSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan data referensi tersedia
        $item = Item::first();
        $supplier = Supplier::first();
        $user = User::where('role', 'gudang')->first() ?? User::first();

        if ($item && $supplier && $user) {
            $stockIns = [
                [
                    'item_id' => $item->id,
                    'supplier_id' => $supplier->id,
                    'user_id' => $user->id,
                    'jumlah_masuk' => 50,
                    'tanggal_masuk' => Carbon::now()->subDays(5),
                ],
                [
                    'item_id' => $item->id,
                    'supplier_id' => $supplier->id,
                    'user_id' => $user->id,
                    'jumlah_masuk' => 30,
                    'tanggal_masuk' => Carbon::now()->subDays(2),
                ],
            ];

            foreach ($stockIns as $data) {
                StockIn::create($data);
            }
        }
    }
}