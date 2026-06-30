<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        /* ── invoices: tambah dp_amount + status baru ── */
        Schema::table('invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('invoices', 'dp_amount')) {
                $table->decimal('dp_amount', 15, 2)->default(0)->after('total_amount');
            }
        });

        DB::statement("ALTER TABLE invoices MODIFY status ENUM('pending','unpaid','dp_paid','partial','paid','failed','cancelled') DEFAULT 'unpaid'");

        /* ── orders: tambah penanda jasa kurir sudah dikirim ── */
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'courier_fee_dispatched')) {
                $table->boolean('courier_fee_dispatched')->default(false)->after('courier_fee');
            }
            if (!Schema::hasColumn('orders', 'courier_fee_dispatched_at')) {
                $table->timestamp('courier_fee_dispatched_at')->nullable()->after('courier_fee_dispatched');
            }
        });

        /* ── invoice_payments: FK payment_channel_id salah arah.
           Selama ini menunjuk ke tabel payment_channels, padahal
           data rekening yang sungguhan dipakai owner & klien ada
           di tabel payment_accounts. Perbaiki supaya konsisten. ── */
        Schema::table('invoice_payments', function (Blueprint $table) {
            $table->dropForeign(['payment_channel_id']);
        });
        Schema::table('invoice_payments', function (Blueprint $table) {
            $table->foreign('payment_channel_id')
                  ->references('id')->on('payment_accounts')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('invoice_payments', function (Blueprint $table) {
            $table->dropForeign(['payment_channel_id']);
        });
        Schema::table('invoice_payments', function (Blueprint $table) {
            $table->foreign('payment_channel_id')
                  ->references('id')->on('payment_channels')
                  ->cascadeOnDelete();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['courier_fee_dispatched', 'courier_fee_dispatched_at']);
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('dp_amount');
        });
    }
};