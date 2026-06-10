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
    Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('client_id')->constrained('users');
    $table->string('type'); // harian / insidentil
    $table->foreignId('menu_id')->constrained('menus');
    $table->integer('quantity');
    $table->integer('duration')->nullable(); // untuk harian
    $table->date('event_date')->nullable(); // untuk insidentil
    $table->string('theme')->nullable();
    $table->string('notes')->nullable();
    $table->string('address');
    $table->decimal('lat', 10, 7);
    $table->decimal('lng', 10, 7);
    $table->decimal('total_price', 8, 2);
    $table->decimal('courier_fee', 8, 2);
    $table->enum('status', ['pending', 'confirmed', 'on_delivery', 'delivered'])->default('pending');
    $table->timestamps();
    $table->date('tanggal')->nullable();
    $table->time('jam')->nullable();
});
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
