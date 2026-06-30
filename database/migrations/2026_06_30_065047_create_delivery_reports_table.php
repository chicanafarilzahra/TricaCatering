<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('delivery_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('kurir_id')->constrained('users')->cascadeOnDelete();
            $table->string('customer');
            $table->string('pesanan')->nullable();
            $table->integer('quantity')->nullable();
            $table->string('waktu', 10)->nullable(); // HH:MM
            $table->boolean('diterima')->default(true);
            $table->text('alasan')->nullable();
            $table->string('photo')->nullable(); // path di storage
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_reports');
    }
};