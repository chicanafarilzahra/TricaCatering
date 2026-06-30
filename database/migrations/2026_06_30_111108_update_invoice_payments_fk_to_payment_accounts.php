<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoice_payments', function (Blueprint $table) {
            $table->dropForeign(['payment_channel_id']);

            $table->foreign('payment_channel_id')
                ->references('id')->on('payment_accounts')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('invoice_payments', function (Blueprint $table) {
            $table->dropForeign(['payment_channel_id']);

            $table->foreign('payment_channel_id')
                ->references('id')->on('payment_channels')
                ->cascadeOnDelete();
        });
    }
};