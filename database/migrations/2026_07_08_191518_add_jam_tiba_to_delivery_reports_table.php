<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('delivery_reports', function (Blueprint $table) {
        $table->string('jam_tiba')->nullable()->after('waktu');
    });
}

    public function down(): void
    {
        Schema::table('delivery_reports', function (Blueprint $table) {
            $table->dropColumn('jam_tiba');
        });
    }
};