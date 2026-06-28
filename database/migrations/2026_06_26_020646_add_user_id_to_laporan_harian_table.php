<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('laporan_harian', function (Blueprint $table) {

            // Tambah kolom dulu jika belum ada
            if (!Schema::hasColumn('laporan_harian', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }

            // Baru buat foreign key
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

        });
    }

    public function down()
    {
        Schema::table('laporan_harian', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumnIfExists('user_id');
        });
    }
};