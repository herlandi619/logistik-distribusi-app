<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            // UserSeeder::class,      // Jalankan user dulu
            // ItemSeeder::class,      // Jalankan master barang
            // SupplierSeeder::class,  // Jalankan master supplier
            // CustomerSeeder::class,  // Jalankan master customer
            // StockInSeeder::class,   // Tambahkan ini
            // StockOutSeeder::class,  // Tambahkan ini
        ]);
    }
}
