<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
  protected $fillable = ['category_id', 'name', 'price', 'quantity', 'description'];
  
  public function category(){
    return $this->belongsTo(Category::class);
  }

  /**
   * Get all transactions for this product
   */
  public function transactions()
  {
    return $this->hasMany(Transaction::class);
  }

  /**
   * Check if product is low in stock
   */
  public function isLowStock($threshold = 10)
  {
    return $this->quantity < $threshold;
  }
}

