<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

Route::get('/products', function () {
    $response = Http::get(
        'https://fakestoreapi.com/products/category/electronics'
    );
    $products = $response->json();
    return view('products', compact('products'));
});
