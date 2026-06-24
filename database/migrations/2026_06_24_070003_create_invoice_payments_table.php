<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('invoice_id')
                ->constrained('invoices')
                ->cascadeOnDelete();

            $table->foreignId('payment_channel_id')
                ->constrained('payment_channels')
                ->cascadeOnDelete();

            $table->enum('type', ['dp', 'pelunasan', 'full'])->default('full');

            $table->decimal('amount', 15, 2);

            $table->string('proof_path')->nullable();
            $table->string('proof_url')->nullable();

            $table->text('note')->nullable();

            $table->enum('status', ['pending', 'confirmed', 'rejected'])->default('pending');

            $table->timestamp('confirmed_at')->nullable();

            $table->foreignId('confirmed_by')
                ->nullable()
                ->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_payments');
    }
};