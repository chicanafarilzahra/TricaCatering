<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('nama_tempat')
                ->nullable()
                ->after('nama_catering');

            $table->text('alamat')
                ->nullable()
                ->after('alamat_catering');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([
                'nama_tempat',
                'alamat',
            ]);
        });
    }
};