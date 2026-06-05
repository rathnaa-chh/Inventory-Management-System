<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

// Root route - welcome
Route::get('/', function () {
    return response()->json([
        'message' => 'Inventory Management System API',
        'version' => '1.0',
        'api_docs' => 'Available at /api',
        'health_check' => '/api/health',
    ]);
});

Route::get('/products', function () {
    $response = Http::get(
        'https://fakestoreapi.com/products/category/electronics'
    );
    $products = $response->json();
    return view('products', compact('products'));
});
