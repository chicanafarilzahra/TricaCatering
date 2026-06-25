<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {

        if (!Schema::hasColumn('orders', 'menu_id')) {
            $table->foreignId('menu_id')
                ->nullable()
                ->after('client_id')
                ->constrained('menus');
        }

        if (!Schema::hasColumn('orders', 'type')) {
            $table->string('type')->nullable()->after('phone');
        }

        if (!Schema::hasColumn('orders', 'quantity')) {
            $table->integer('quantity')->default(1)->after('menu_id');
        }

        if (!Schema::hasColumn('orders', 'duration')) {
            $table->integer('duration')->nullable();
        }

        if (!Schema::hasColumn('orders', 'event_date')) {
            $table->date('event_date')->nullable();
        }

        if (!Schema::hasColumn('orders', 'theme')) {
            $table->string('theme')->nullable();
        }

        if (!Schema::hasColumn('orders', 'notes')) {
            $table->text('notes')->nullable();
        }

        if (!Schema::hasColumn('orders', 'lat')) {
            $table->decimal('lat', 10, 7)->nullable();
        }

        if (!Schema::hasColumn('orders', 'lng')) {
            $table->decimal('lng', 10, 7)->nullable();
        }

        if (!Schema::hasColumn('orders', 'courier_fee')) {
            $table->decimal('courier_fee', 10, 2)->default(0);
        }

        if (!Schema::hasColumn('orders', 'tanggal')) {
            $table->date('tanggal')->nullable();
        }

        if (!Schema::hasColumn('orders', 'jam')) {
            $table->time('jam')->nullable();
        }
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