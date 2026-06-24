<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {

            $table->foreignId('menu_id')
                ->nullable()
                ->after('client_id')
                ->constrained('menus');

            $table->string('type')
                ->nullable()
                ->after('phone');

            $table->integer('quantity')
                ->default(1)
                ->after('menu_id');

            $table->integer('duration')
                ->nullable();

            $table->date('event_date')
                ->nullable();

            $table->string('theme')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->decimal('lat', 10, 7)
                ->nullable();

            $table->decimal('lng', 10, 7)
                ->nullable();

            $table->decimal('courier_fee', 10, 2)
                ->default(0);

            $table->date('tanggal')
                ->nullable();

            $table->time('jam')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {

            $table->dropForeign(['menu_id']);

            $table->dropColumn([
                'menu_id',
                'type',
                'quantity',
                'duration',
                'event_date',
                'theme',
                'notes',
                'lat',
                'lng',
                'courier_fee',
                'tanggal',
                'jam',
            ]);
        });
    }
};