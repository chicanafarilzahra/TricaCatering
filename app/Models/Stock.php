<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable=[
        'name',
        'qty',
        'unit',
        'minimum_stock'
    ];

    public function menus()
    {
        return $this->belongsToMany(
            Menu::class,
            'menu_bahan'
        )->withPivot('qty');
    }
}