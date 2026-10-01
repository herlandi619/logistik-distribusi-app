<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        \App\Models\User::create([
            'name' => 'Admin Utama',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Staf Gudang
        \App\Models\User::create([
            'name' => 'Staf Gudang',
            'email' => 'gudang@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'gudang',
        ]);

        // Kasir
        \App\Models\User::create([
            'name' => 'Kasir Utama',
            'email' => 'kasir@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'kasir',
        ]);
    }
}
