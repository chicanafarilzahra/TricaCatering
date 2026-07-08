<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distribusi_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribusi_id')->constrained('distribusis');
            $table->foreignId('kurir_id')->constrained('users');

            // snapshot, biar histori tetap utuh walau data sekolah/menu berubah
            $table->string('nama_sekolah')->nullable();
            $table->string('menu')->nullable();
            $table->integer('jumlah_porsi')->nullable();

            $table->string('jam_berangkat', 10)->nullable();
            $table->string('jam_tiba', 10);
            $table->enum('status_distribusi', ['Berhasil', 'Gagal'])->default('Berhasil');
            $table->string('nama_penerima');
            $table->enum('status_penerimaan', ['Diterima', 'Ditolak']);
            $table->enum('kondisi_makanan', ['Baik', 'Rusak', 'Sebagian'])->default('Baik');
            $table->string('photo')->nullable();
            $table->text('catatan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distribusi_reports');
    }
};