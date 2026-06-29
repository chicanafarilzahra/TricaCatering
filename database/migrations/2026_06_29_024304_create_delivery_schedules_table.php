<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->date('tanggal_kirim');
            $table->time('jam_kirim');
            $table->enum('status', ['scheduled', 'on_delivery', 'delivered', 'skipped'])
                  ->default('scheduled');
            $table->unsignedBigInteger('kurir_id')->nullable();
            $table->timestamps();

            $table->index('kurir_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_schedules');
    }
};