<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ulasan extends Model
{
    protected $fillable = [
        'order_id',
        'client_id',
        'rating',
        'komentar',
        'tags',
    ];

    protected $casts = [
        'tags'   => 'array',
        'rating' => 'integer',
    ];

    /**
     * Alias relasi ke Order, supaya response JSON cocok dengan
     * frontend yang membaca `item.pesanan.menu.name` dan
     * `item.pesanan_id`.
     */
    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // accessor supaya field pesanan_id ikut muncul di JSON (selain order_id)
    public function getPesananIdAttribute()
    {
        return $this->order_id;
    }

    protected $appends = ['pesanan_id'];
}