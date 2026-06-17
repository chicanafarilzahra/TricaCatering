<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_sppgs', function (Blueprint $table) {

            $table->id();

            $table->foreignId('sppg_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->string('name');

            $table->integer('qty');

            $table->string('unit');

            $table->integer('minimum_stock')
                  ->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_sppgs');
    }
};