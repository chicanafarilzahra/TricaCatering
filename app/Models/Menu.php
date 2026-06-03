<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = [
        'name',
        'price',
        'category',
        'stock',
        'description',
        'image',
        'jenis_catering',
        'min_porsi',
    ];
}