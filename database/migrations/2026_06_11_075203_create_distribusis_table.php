<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distribusis', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('sppg_id');
            $table->unsignedBigInteger('sekolah_id');
            $table->unsignedBigInteger('menu_id');

            $table->date('tanggal');
            $table->integer('jumlah_porsi');

            $table->enum('status',[
                'Diproses',
                'Disiapkan',
                'Dikirim',
                'Selesai'
            ])->default('Diproses');

            $table->timestamps();

            $table->foreign('sppg_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('sekolah_id')
                  ->references('id')
                  ->on('sekolahs')
                  ->onDelete('cascade');

            $table->foreign('menu_id')
                ->references('id')
                ->on('sppg_menus')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distribusis');
    }
};