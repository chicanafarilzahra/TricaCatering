<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('nama_tempat_kurir')
                ->nullable()
                ->after('alamat_catering');

            $table->text('alamat_tempat_kurir')
                ->nullable()
                ->after('nama_tempat_kurir');

        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([
                'nama_tempat_kurir',
                'alamat_tempat_kurir',
            ]);

        });
    }
};