<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {

            $table->id();

            $table->foreignId('owner_id');

            $table->string('name');

            $table->text('description')->nullable();

            $table->integer('price');

            $table->string('category');

            $table->string('jenis_catering')->default('Insidentil');

            $table->integer('min_porsi')->default(1);

            $table->string('image')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};