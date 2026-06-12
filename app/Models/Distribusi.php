<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribusi extends Model
{
    protected $fillable = [
        'sppg_id',
        'sekolah_id',
        'menu_id',
        'tanggal',
        'jumlah_porsi',
        'status',
    ];

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class);
    }

    public function menu()
    {
        return $this->belongsTo(SppgMenu::class);
    }

}