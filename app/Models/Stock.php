<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

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

    public function owner()
{
    return $this->belongsTo(
        User::class,
        'owner_id'
    );
}
}