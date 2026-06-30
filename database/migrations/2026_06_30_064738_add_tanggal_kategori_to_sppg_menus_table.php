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
    Schema::table('sppg_menus', function (Blueprint $table) {
        $table->date('tanggal')->nullable()->after('nama_menu');
        $table->string('kategori')->nullable()->after('deskripsi');
    });
}

public function down(): void
{
    Schema::table('sppg_menus', function (Blueprint $table) {
        $table->dropColumn(['tanggal', 'kategori']);
    });
}
};
