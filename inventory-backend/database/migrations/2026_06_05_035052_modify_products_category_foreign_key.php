<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the existing foreign key
            $table->dropForeign(['category_id']);
            
            // Recreate it with cascade on delete
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the cascading foreign key
            $table->dropForeign(['category_id']);
            
            // Recreate the original constraint
            $table->foreign('category_id')
                ->references('id')
                ->on('categories');
        });
    }
};
