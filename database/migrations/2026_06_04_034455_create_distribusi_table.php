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
        Schema::create('distribusi', function (Blueprint $table) {

            $table->id();

            $table->foreignId('school_id')
                ->constrained('schools');

            $table->date('tanggal');

            $table->integer('jumlah_porsi');

            $table->time('jam_kirim');

            $table->enum('status',[
                'menunggu',
                'perjalanan',
                'selesai'
            ]);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribusi');
    }
};
