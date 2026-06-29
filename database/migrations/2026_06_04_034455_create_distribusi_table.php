<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('distribusis', function (Blueprint $table) {
            $table->enum('status', ['Diproses', 'Disiapkan', 'Dikirim', 'Selesai'])
                  ->default('Diproses')
                  ->change();
        });
    }

    public function down()
    {
        Schema::table('distribusis', function (Blueprint $table) {
            $table->enum('status', ['Diproses', 'Disiapkan', 'Dikirim', 'Selesai'])
                  ->change();
        });
    }
};