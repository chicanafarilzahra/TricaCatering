<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryReport extends Model
{
    protected $fillable = [
        'order_id', 'kurir_id', 'customer', 'pesanan',
        'quantity', 'waktu', 'diterima', 'alasan', 'photo',
    ];

    protected $casts = [
        'diterima' => 'boolean',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function kurir()
    {
        return $this->belongsTo(User::class, 'kurir_id');
    }
}