<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [

        'client_id',

        'package_id',

        'total_price',

        'delivery_date',

        'status',
    ];


    public function client()
    {
        return $this->belongsTo(
            Client::class
        );
    }


    public function package()
    {
        return $this->belongsTo(
            Package::class
        );
    }
}