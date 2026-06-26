<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained('wallets')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();

            // credit = saldo bertambah, debit = saldo berkurang
            $table->enum('type', ['credit', 'debit'])->default('credit');

            // Kategori transaksi, biar mudah dibedakan di riwayat:
            // 'menu_payment' (uang harga menu masuk ke owner)
            // 'courier_fee'  (uang jasa kurir masuk ke kurir)
            // 'withdrawal', 'adjustment', dst bisa ditambah nanti
            $table->string('category')->default('menu_payment');

            $table->decimal('amount', 14, 2);
            $table->decimal('balance_after', 14, 2);
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};