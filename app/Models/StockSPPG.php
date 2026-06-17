<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class StockSPPG extends Model
{
    protected $table = 'stock_sppgs';

    protected $fillable = [
        'sppg_id',
        'name',
        'qty',
        'unit',
        'minimum_stock',
    ];

    public function sppg()
    {
        return $this->belongsTo(
            User::class,
            'sppg_id'
        );
    }
}