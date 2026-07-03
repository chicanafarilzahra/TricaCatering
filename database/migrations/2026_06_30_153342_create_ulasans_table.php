<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ulasans', function (Blueprint $table) {
            $table->id();

            // pesanan_id merujuk ke tabel orders (1 pesanan = 1 ulasan)
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();

            $table->unsignedTinyInteger('rating'); // 1-5
            $table->text('komentar')->nullable();
            $table->json('tags')->nullable();

            $table->timestamps();

            // satu pesanan hanya boleh punya satu ulasan
            $table->unique('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ulasans');
    }
};