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
        Schema::create('stocks', function (Blueprint $table) {

    $table->id();

    // pemilik stock
    $table->foreignId('owner_id')->nullable();

    // jika stock milik SPPG
    $table->foreignId('sppg_id')->nullable();

    // nama bahan
    $table->string('name');

    // kategori
    $table->string('category')->nullable();

    // jumlah stock
    $table->decimal('qty',10,2);

    // satuan
    $table->string('unit');

    // batas minimum
    $table->decimal('minimum_stock',10,2)->default(0);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
