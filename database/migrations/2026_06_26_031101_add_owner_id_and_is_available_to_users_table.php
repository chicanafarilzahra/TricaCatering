<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kurir terikat ke 1 owner (pemilik catering) tertentu.
            // Diisi hanya untuk user dengan role 'kurir'.
            // Mengacu ke users.id milik user yang role-nya 'owner'.
            if (!Schema::hasColumn('users', 'owner_id')) {
                $table->foreignId('owner_id')->nullable()->after('id')
                    ->constrained('users')->nullOnDelete();
            }

            // Status ketersediaan kurir.
            // true  = available, boleh masuk antrian round-robin
            // false = sedang mengantar order lain, dilewati saat round-robin
            if (!Schema::hasColumn('users', 'is_available')) {
                $table->boolean('is_available')->default(true)->after('owner_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_available')) {
                $table->dropColumn('is_available');
            }
            if (Schema::hasColumn('users', 'owner_id')) {
                $table->dropConstrainedForeignId('owner_id');
            }
        });
    }
};