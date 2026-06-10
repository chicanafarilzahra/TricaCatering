<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('sekolahs', function (Blueprint $table) {

        $table->unsignedBigInteger('sppg_id')->after('id');

    });
}

public function down()
{
    Schema::table('sekolahs', function (Blueprint $table) {

        $table->dropColumn('sppg_id');

    });
}
};
