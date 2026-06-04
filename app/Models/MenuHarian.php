<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuHarian extends Model
{
    protected $table =
        'menu_harian';

    protected $fillable = [

        'tanggal',
        'menu_id'
    ];

    public function menu()
    {
        return $this->belongsTo(
            Menu::class
        );
    }
}
