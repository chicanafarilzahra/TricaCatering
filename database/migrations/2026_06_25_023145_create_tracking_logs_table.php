<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    if (Schema::hasTable('tracking_logs')) {
        return;
    }

    Schema::create('tracking_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained()->onDelete('cascade');
        $table->foreignId('kurir_id')->constrained('users')->onDelete('cascade');
        $table->decimal('latitude', 10, 8);
        $table->decimal('longitude', 11, 8);
        $table->double('accuracy')->nullable();
        $table->timestamp('recorded_at')->useCurrent();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('tracking_logs');
    }
};