<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Bukti pembayaran yang diupload klien (path file di storage)
            if (!Schema::hasColumn('orders', 'payment_proof')) {
                $table->string('payment_proof')->nullable()->after('courier_fee');
            }

            // Alasan reject HANYA diisi kalau owner yang menolak bukti pembayaran.
            // Kalau klien batalkan sendiri, kolom ini dibiarkan NULL.
            // Status order tetap pakai enum yang sudah ada:
            // pending -> confirmed -> preparing -> dispatched -> on_delivery -> delivered
            // cancelled dipakai untuk: klien batal sendiri ATAU owner reject bukti bayar
            if (!Schema::hasColumn('orders', 'reject_reason')) {
                $table->text('reject_reason')->nullable()->after('payment_proof');
            }

            // Catatan: kolom kurir untuk penugasan SUDAH ADA bernama 'kurir_id',
            // jadi tidak perlu tambah kolom courier_id baru.

            // Waktu-waktu penting untuk tracking proses
            if (!Schema::hasColumn('orders', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('reject_reason'); // saat klien upload bukti
            }
            if (!Schema::hasColumn('orders', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('paid_at'); // saat owner approve (-> preparing)
            }
            if (!Schema::hasColumn('orders', 'dispatched_at')) {
                $table->timestamp('dispatched_at')->nullable()->after('approved_at'); // saat owner klik kirim (-> dispatched)
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_proof',
                'reject_reason',
                'paid_at',
                'approved_at',
                'dispatched_at',
            ]);
        });
    }
};