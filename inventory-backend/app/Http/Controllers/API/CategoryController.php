<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET ALL
    public function index()
    {
        return response()->json(Category::all());
    }
    // STORE
    public function store(Request $request)
    {
        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($category, 201);
    }
    // SHOW ONE
    public function show(string $id)
    {
        return response()->json(Category::findOrFail($id));
    }
    // UPDATE
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $category->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);
        return response()->json($category);
    }
    // DELETE
    public function destroy(string $id)
    {
        Category::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Category deleted'
        ]);
    }
}