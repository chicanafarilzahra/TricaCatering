<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sppg_menus', function (Blueprint $table) {
            if (!Schema::hasColumn('sppg_menus', 'gambar')) {
                $table->string('gambar')->nullable()->after('lemak');
            }
            if (!Schema::hasColumn('sppg_menus', 'serat')) {
                $table->decimal('serat', 8, 2)->nullable()->after('gambar');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sppg_menus', function (Blueprint $table) {
            $table->dropColumnIfExists('gambar');
            $table->dropColumnIfExists('serat');
        });
    }
};