<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        if (!Schema::hasColumn('orders', 'dispatched_at')) {
            $table->timestamp('dispatched_at')->nullable();
        }
        // lat_dapur/lng_dapur/lat_klien/lng_klien diasumsikan SUDAH ADA
        // dari fitur geocoding yang sebelumnya dibuat. Kalau belum ada, uncomment:
        // $table->decimal('lat_dapur', 10, 7)->nullable();
        // $table->decimal('lng_dapur', 10, 7)->nullable();
        // $table->decimal('lat_klien', 10, 7)->nullable();
        // $table->decimal('lng_klien', 10, 7)->nullable();
    });

    Schema::table('delivery_schedules', function (Blueprint $table) {
        $table->timestamp('on_delivery_at')->nullable();
        $table->timestamp('delivered_at')->nullable();
        $table->decimal('kurir_lat', 10, 7)->nullable();
        $table->decimal('kurir_lng', 10, 7)->nullable();
    });
}

public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropColumn('dispatched_at');
    });
    Schema::table('delivery_schedules', function (Blueprint $table) {
        $table->dropColumn(['on_delivery_at', 'delivered_at', 'kurir_lat', 'kurir_lng']);
    });
}
};