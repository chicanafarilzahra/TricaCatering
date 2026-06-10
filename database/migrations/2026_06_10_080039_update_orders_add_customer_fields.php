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
    Schema::table('orders', function (Blueprint $table) {

        if (!Schema::hasColumn('orders', 'customer_name')) {
            $table->string('customer_name')->after('client_id');
        }

        if (!Schema::hasColumn('orders', 'phone')) {
            $table->string('phone')->after('customer_name');
        }

        if (!Schema::hasColumn('orders', 'order_date')) {
            $table->date('order_date')->nullable()->after('phone');
        }

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
