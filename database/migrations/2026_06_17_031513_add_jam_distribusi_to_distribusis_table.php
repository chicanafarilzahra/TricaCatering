<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('distribusis', function (Blueprint $table) {
        $table->time('jam_distribusi')
              ->nullable()
              ->after('tanggal');
    });
}

public function down(): void
{
    Schema::table('distribusis', function (Blueprint $table) {
        $table->dropColumn('jam_distribusi');
    });
}
};
