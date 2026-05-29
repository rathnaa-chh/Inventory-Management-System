<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@inventory.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Manager user
        User::create([
            'name' => 'Manager User',
            'email' => 'manager@inventory.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
        ]);

        // Staff user
        User::create([
            'name' => 'Staff User',
            'email' => 'staff@inventory.com',
            'password' => Hash::make('password123'),
            'role' => 'staff',
        ]);
    }
}
