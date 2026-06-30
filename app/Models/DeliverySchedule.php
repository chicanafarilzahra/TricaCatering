<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliverySchedule extends Model
{
    protected $fillable = [
        'order_id', 'tanggal_kirim', 'jam_kirim', 'status',
        'on_delivery_at', 'delivered_at', 'kurir_lat', 'kurir_lng',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}