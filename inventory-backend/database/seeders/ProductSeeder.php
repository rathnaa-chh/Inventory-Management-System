<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Electronics (Category ID: 1)
            [
                'category_id' => 1,
                'name' => 'Laptop Pro',
                'description' => 'High-performance laptop for professionals',
                'price' => 1299.99,
                'quantity' => 25,
            ],
            [
                'category_id' => 1,
                'name' => 'Mouse Wireless',
                'description' => 'Ergonomic wireless mouse',
                'price' => 29.99,
                'quantity' => 150,
            ],
            [
                'category_id' => 1,
                'name' => 'Keyboard RGB',
                'description' => 'Mechanical keyboard with RGB lighting',
                'price' => 89.99,
                'quantity' => 80,
            ],
            [
                'category_id' => 1,
                'name' => 'Monitor 4K',
                'description' => '27-inch 4K display monitor',
                'price' => 499.99,
                'quantity' => 15,
            ],
            [
                'category_id' => 1,
                'name' => 'USB Cable',
                'description' => 'High-speed USB 3.0 cable',
                'price' => 9.99,
                'quantity' => 500,
            ],

            // Furniture (Category ID: 2)
            [
                'category_id' => 2,
                'name' => 'Office Chair',
                'description' => 'Comfortable office chair with lumbar support',
                'price' => 199.99,
                'quantity' => 40,
            ],
            [
                'category_id' => 2,
                'name' => 'Standing Desk',
                'description' => 'Adjustable electric standing desk',
                'price' => 399.99,
                'quantity' => 20,
            ],

            // Clothing (Category ID: 3)
            [
                'category_id' => 3,
                'name' => 'T-Shirt',
                'description' => 'Cotton t-shirt',
                'price' => 19.99,
                'quantity' => 200,
            ],
            [
                'category_id' => 3,
                'name' => 'Jeans',
                'description' => 'Blue denim jeans',
                'price' => 49.99,
                'quantity' => 100,
            ],

            // Books (Category ID: 4)
            [
                'category_id' => 4,
                'name' => 'Web Development Guide',
                'description' => 'Complete guide to web development',
                'price' => 39.99,
                'quantity' => 50,
            ],
            [
                'category_id' => 4,
                'name' => 'Python Basics',
                'description' => 'Learn Python programming basics',
                'price' => 29.99,
                'quantity' => 75,
            ],

            // Food & Beverages (Category ID: 5)
            [
                'category_id' => 5,
                'name' => 'Coffee Beans',
                'description' => 'Premium arabica coffee beans',
                'price' => 12.99,
                'quantity' => 300,
            ],
            [
                'category_id' => 5,
                'name' => 'Green Tea',
                'description' => 'Organic green tea',
                'price' => 8.99,
                'quantity' => 250,
            ],

            // Sports (Category ID: 6)
            [
                'category_id' => 6,
                'name' => 'Yoga Mat',
                'description' => 'Non-slip yoga mat',
                'price' => 24.99,
                'quantity' => 60,
            ],
            [
                'category_id' => 6,
                'name' => 'Dumbbells Set',
                'description' => '20kg adjustable dumbbells set',
                'price' => 79.99,
                'quantity' => 30,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
