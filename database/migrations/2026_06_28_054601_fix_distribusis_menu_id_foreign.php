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
        // drop FK lama yang pointing ke menus
        $table->dropForeign(['menu_id']);

        // tambah FK baru pointing ke sppg_menus
        $table->foreign('menu_id')
              ->references('id')
              ->on('sppg_menus')
              ->onDelete('cascade');
    });
}

public function down(): void
{
    Schema::table('distribusis', function (Blueprint $table) {
        $table->dropForeign(['menu_id']);
        $table->foreign('menu_id')
              ->references('id')
              ->on('menus')
              ->onDelete('cascade');
    });
}
};
