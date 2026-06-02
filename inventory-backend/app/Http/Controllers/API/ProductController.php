<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('category')->get();
    }
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required',
        'category_id' => 'required|exists:categories,id',
        'price' => 'required',
        'quantity' => 'required',
    ]);

    return Product::create($request->all());
} 
    public function show(int $id)
    {
        return Product::findOrFail($id);
    }
    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return $product;
    }
    public function destroy(int $id)
    {
        Product::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
    
}