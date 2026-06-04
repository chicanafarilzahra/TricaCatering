<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders'; // pastikan ini sesuai nama tabel di DB
    protected $fillable = [
        'client_id','type','menu_id','quantity','duration','event_date','theme','notes',
        'address','lat','lng','total_price','courier_fee','status'
    ];


    public function courierLocation() {
        return $this->hasOne(CourierLocation::class);
    }

    public function menu() {
        return $this->belongsTo(Menu::class);
    }
}