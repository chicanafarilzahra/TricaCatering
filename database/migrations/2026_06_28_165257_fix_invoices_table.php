<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {

            // Tambah dp_amount — jumlah DP yang sudah dikonfirmasi admin
            if (!Schema::hasColumn('invoices', 'dp_amount')) {
                $table->decimal('dp_amount', 15, 2)->default(0)->after('total_amount');
            }

            // Ubah status dari ENUM sempit → string supaya bisa pakai semua nilai
            // Nilai lama: pending | partial | paid | cancelled
            // Nilai baru: unpaid | pending | dp_paid | paid | selesai | cancelled
            $table->string('status')->default('unpaid')->change();
        });

        // Migrate data status lama → baru
        // 'partial' → 'dp_paid'
        DB::table('invoices')->where('status', 'partial')->update(['status' => 'dp_paid']);

        // 'pending' yang belum punya payment → artinya belum dibayar → 'unpaid'
        // 'pending' yang sudah punya payment → tetap 'pending' (menunggu konfirmasi)
        DB::table('invoices')
            ->where('status', 'pending')
            ->whereNotExists(function ($q) {
                $q->select(DB::raw(1))
                  ->from('invoice_payments')
                  ->whereColumn('invoice_payments.invoice_id', 'invoices.id');
            })
            ->update(['status' => 'unpaid']);
    }

    public function down(): void
    {
        // Kembalikan status baru → lama sebelum drop kolom
        DB::table('invoices')->where('status', 'unpaid') ->update(['status' => 'pending']);
        DB::table('invoices')->where('status', 'dp_paid')->update(['status' => 'partial']);
        DB::table('invoices')->where('status', 'selesai')->update(['status' => 'paid']);

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('dp_amount');
            $table->enum('status', ['pending', 'partial', 'paid', 'cancelled'])
                  ->default('pending')
                  ->change();
        });
    }
};