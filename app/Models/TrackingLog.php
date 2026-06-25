<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingLog extends Model
{
    // Tabel ini tidak punya updated_at
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'kurir_id',
        'latitude',
        'longitude',
        'accuracy',
        'recorded_at',
    ];

    protected $casts = [
        'latitude'    => 'float',
        'longitude'   => 'float',
        'accuracy'    => 'float',
        'recorded_at' => 'datetime',
    ];

    // Relasi ke Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relasi ke User (kurir)
    public function kurir()
    {
        return $this->belongsTo(User::class, 'kurir_id');
    }
}