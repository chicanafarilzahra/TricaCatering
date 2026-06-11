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
        Schema::create('sppg_menus', function (Blueprint $table) {

            $table->id();

            // Operator SPPG yang membuat menu
            $table->foreignId('sppg_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('nama_menu');

            $table->text('deskripsi')->nullable();

            $table->decimal('harga', 10, 2)->nullable();

            $table->integer('kalori')->nullable();

            $table->integer('protein')->nullable();

            $table->integer('karbohidrat')->nullable();

            $table->integer('lemak')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sppg_menus');
    }
};