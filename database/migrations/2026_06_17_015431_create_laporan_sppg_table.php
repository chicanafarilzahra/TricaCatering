<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_sppg', function (Blueprint $table) {
            $table->id();

            $table->date('tanggal');

            $table->string('sekolah');

            $table->integer('total_paket')->default(0);

            $table->integer('total_penerima')->default(0);

            $table->enum('status', [
                'Sukses',
                'Gagal'
            ])->default('Sukses');

            $table->text('catatan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_sppg');
    }
};