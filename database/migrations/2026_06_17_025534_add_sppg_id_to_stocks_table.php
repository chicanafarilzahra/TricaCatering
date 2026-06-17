<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stocks', function (Blueprint $table) {

            $table->unsignedBigInteger('sppg_id')
                  ->after('id');

            $table->foreign('sppg_id')
                  ->references('id')
                  ->on('users')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('stocks', function (Blueprint $table) {

            $table->dropForeign(['sppg_id']);
            $table->dropColumn('sppg_id');
        });
    }
};