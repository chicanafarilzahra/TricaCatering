<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')
                  ->constrained('menus')
                  ->cascadeOnDelete();
            $table->foreignId('stock_id')
                  ->constrained('stocks')
                  ->cascadeOnDelete();
            $table->decimal('qty_per_portion', 10, 3); // jumlah bahan per 1 porsi
            $table->timestamps();

            // satu menu tidak boleh punya bahan yang sama dua kali
            $table->unique(['menu_id', 'stock_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_ingredients');
    }
};