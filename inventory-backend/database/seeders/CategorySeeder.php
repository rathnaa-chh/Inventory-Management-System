<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics'],
            ['name' => 'Furniture'],
            ['name' => 'Clothing'],
            ['name' => 'Books'],
            ['name' => 'Food & Beverages'],
            ['name' => 'Sports'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
