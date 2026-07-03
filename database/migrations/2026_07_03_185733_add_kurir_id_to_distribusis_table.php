<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom kurir_id ke tabel distribusis, agar setiap jadwal
     * distribusi bisa diklaim/ditugaskan ke kurir SPPG tertentu.
     * Nullable karena distribusi yang statusnya masih "Diproses"/"Disiapkan"
     * dan belum diambil kurir manapun harus tetap bisa disimpan.
     */
    public function up(): void
    {
        Schema::table('distribusis', function (Blueprint $table) {
            $table->foreignId('kurir_id')
                ->nullable()
                ->after('sppg_id')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('distribusis', function (Blueprint $table) {
            $table->dropForeign(['kurir_id']);
            $table->dropColumn('kurir_id');
        });
    }
};