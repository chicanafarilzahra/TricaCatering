<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'nama_catering')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('nama_catering')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'nama_catering')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('nama_catering');
            });
        }
    }
};