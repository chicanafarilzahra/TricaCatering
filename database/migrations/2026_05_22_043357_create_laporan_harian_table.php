<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
    Schema::create('laporan_harian', function (Blueprint $table) {
    $table->id();
    $table->string('customer');
    $table->string('pesanan');
    $table->integer('quantity');
    $table->time('waktu');
    $table->boolean('diterima');
    $table->string('alasan')->nullable();
    $table->string('photo')->nullable();
    $table->integer('delivery_fee')->default(50000);
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_harian');
    }
};
