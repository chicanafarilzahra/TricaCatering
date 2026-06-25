<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Tambah kurir_id setelah client_id
            $table->foreignId('kurir_id')
                  ->nullable()
                  ->after('client_id')
                  ->constrained('users')
                  ->nullOnDelete();

            // Index untuk query "Rute Hari Ini":
            // WHERE kurir_id = ? AND tanggal = ?
            $table->index(['kurir_id', 'tanggal'], 'idx_orders_kurir_tanggal');

            // Cache koordinat kurir terakhir
            // (agar halaman klien bisa tampil langsung tanpa tunggu broadcast)
            $table->decimal('last_kurir_lat', 10, 8)->nullable()->after('status');
            $table->decimal('last_kurir_lng', 11, 8)->nullable()->after('last_kurir_lat');
            $table->timestamp('last_location_at')->nullable()->after('last_kurir_lng');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_kurir_tanggal');
            $table->dropForeign(['kurir_id']);
            $table->dropColumn(['kurir_id', 'last_kurir_lat', 'last_kurir_lng', 'last_location_at']);
        });
    }
};