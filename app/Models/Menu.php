<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Menu extends Model
{
    protected $fillable = [
    'owner_id',
    'name',
    'description',
    'price',
    'category',
    'stock',
    'image',
    'is_active',
    'jenis_catering',
    'min_porsi',
];
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}