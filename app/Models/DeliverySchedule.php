<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliverySchedule extends Model
{
    protected $fillable = ['order_id', 'tanggal_kirim', 'jam_kirim', 'status', 'kurir_id'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}