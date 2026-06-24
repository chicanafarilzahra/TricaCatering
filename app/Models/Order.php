<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders'; // pastikan ini sesuai nama tabel di DB
   protected $fillable = [
    'owner_id',
    'client_id',
    'customer_name',
    'phone',
    'address',
    'order_date',
    'total_price',
    'status',
    'type',
    'menu_id',
    'quantity',
    'duration',
    'event_date',
    'theme',
    'notes',
    'lat',
    'lng',
    'courier_fee',
];

    public function courierLocation() {
        return $this->hasOne(CourierLocation::class);
    }

    public function menu() {
        return $this->belongsTo(Menu::class);
    }
}