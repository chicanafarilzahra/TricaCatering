<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('distribusis', function (Blueprint $table) {
        $table->id();
        $table->foreignId('sekolah_id')->constrained('sekolahs');
        $table->foreignId('menu_id')->nullable()->constrained('menus');
        $table->date('tanggal');
        $table->integer('jumlah_porsi');
        $table->time('jam_distribusi');
        $table->enum('status', ['Diproses', 'Disiapkan', 'Dikirim', 'Selesai'])
              ->default('Diproses');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('distribusis');
}
};
