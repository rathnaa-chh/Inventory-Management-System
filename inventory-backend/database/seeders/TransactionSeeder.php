<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $users = User::all();

        // Create sample transactions
        $transactions = [
            // Recent Stock In
            [
                'product_id' => $products->first()->id,
                'user_id' => $users->where('role', 'admin')->first()->id,
                'type' => 'IN',
                'quantity' => 10,
                'notes' => 'Bulk order from supplier',
                'created_at' => now()->subDays(2),
            ],
            [
                'product_id' => $products->skip(1)->first()->id,
                'user_id' => $users->where('role', 'staff')->first()->id,
                'type' => 'IN',
                'quantity' => 50,
                'notes' => 'Restocking',
                'created_at' => now()->subDays(3),
            ],
            [
                'product_id' => $products->skip(2)->first()->id,
                'user_id' => $users->where('role', 'admin')->first()->id,
                'type' => 'IN',
                'quantity' => 100,
                'notes' => 'New supplier shipment',
                'created_at' => now()->subDays(5),
            ],

            // Recent Stock Out
            [
                'product_id' => $products->skip(3)->first()->id,
                'user_id' => $users->where('role', 'staff')->first()->id,
                'type' => 'OUT',
                'quantity' => 5,
                'notes' => 'Sale',
                'created_at' => now()->subDays(1),
            ],
            [
                'product_id' => $products->skip(4)->first()->id,
                'user_id' => $users->where('role', 'manager')->first()->id,
                'type' => 'OUT',
                'quantity' => 25,
                'notes' => 'Customer purchase',
                'created_at' => now()->subDays(4),
            ],
            [
                'product_id' => $products->skip(5)->first()->id,
                'user_id' => $users->where('role', 'staff')->first()->id,
                'type' => 'OUT',
                'quantity' => 10,
                'notes' => 'Damage - Return',
                'created_at' => now()->subDays(6),
            ],

            // More transactions
            [
                'product_id' => $products->skip(6)->first()->id,
                'user_id' => $users->where('role', 'admin')->first()->id,
                'type' => 'IN',
                'quantity' => 20,
                'notes' => 'Restock from warehouse',
                'created_at' => now()->subDays(7),
            ],
            [
                'product_id' => $products->skip(7)->first()->id,
                'user_id' => $users->where('role', 'staff')->first()->id,
                'type' => 'OUT',
                'quantity' => 30,
                'notes' => 'Bulk sale',
                'created_at' => now()->subDays(8),
            ],
            [
                'product_id' => $products->skip(8)->first()->id,
                'user_id' => $users->where('role', 'manager')->first()->id,
                'type' => 'IN',
                'quantity' => 75,
                'notes' => 'Order received',
                'created_at' => now()->subDays(10),
            ],
            [
                'product_id' => $products->skip(9)->first()->id,
                'user_id' => $users->where('role', 'staff')->first()->id,
                'type' => 'OUT',
                'quantity' => 15,
                'notes' => 'Regular sale',
                'created_at' => now()->subDays(12),
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}
