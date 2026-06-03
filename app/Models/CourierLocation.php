<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierLocation extends Model
{
    protected $fillable = ['order_id', 'lat', 'lng'];

    public function order() {
        return $this->belongsTo(Order::class);
    }
}
