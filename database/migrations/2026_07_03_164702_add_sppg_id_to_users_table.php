<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kurir bisa terhubung ke catering (owner_id, sudah ada) ATAU ke SPPG (sppg_id, baru).
            // Keduanya menunjuk ke id di tabel users juga (role owner / operator_sppg).
            $table->unsignedBigInteger('sppg_id')->nullable()->after('owner_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('sppg_id');
        });
    }
};