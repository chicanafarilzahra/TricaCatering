<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_channels', function (Blueprint $table) {

            // Kolom lama hanya ada: type, name, account_name, account_number, logo
            // Model & frontend butuh: bank_name, wallet_name, is_active, owner_id

            if (!Schema::hasColumn('payment_channels', 'bank_name')) {
                $table->string('bank_name')->nullable()->after('type');
            }

            if (!Schema::hasColumn('payment_channels', 'wallet_name')) {
                $table->string('wallet_name')->nullable()->after('bank_name');
            }

            if (!Schema::hasColumn('payment_channels', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('logo');
            }

            if (!Schema::hasColumn('payment_channels', 'owner_id')) {
                $table->foreignId('owner_id')
                    ->nullable()
                    ->after('is_active')
                    ->constrained('users')
                    ->nullOnDelete();
            }
        });

        // Salin nilai kolom 'name' ke bank_name / wallet_name untuk data yang sudah ada
        DB::table('payment_channels')->get()->each(function ($ch) {
            DB::table('payment_channels')->where('id', $ch->id)->update([
                'bank_name'   => $ch->type === 'bank'    ? $ch->name : null,
                'wallet_name' => $ch->type === 'ewallet' ? $ch->name : null,
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('payment_channels', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropColumn(['bank_name', 'wallet_name', 'is_active', 'owner_id']);
        });
    }
};