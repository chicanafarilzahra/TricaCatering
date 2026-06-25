<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('tracking_logs');

        Schema::create('tracking_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->cascadeOnDelete();

            $table->foreignId('kurir_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);

            // Akurasi GPS dalam meter — untuk filter sinyal lemah
            $table->float('accuracy')->nullable();

            $table->timestamp('recorded_at')->useCurrent();

            $table->index(['order_id', 'recorded_at'], 'idx_tracking_order_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_logs');
    }
};