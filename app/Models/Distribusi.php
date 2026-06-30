<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribusi extends Model
{
    protected $table = 'distribusis';

    protected $fillable = [
        'sppg_id',
        'sekolah_id',
        'menu_id',
        'tanggal',
        'jam_distribusi',
        'jumlah_porsi',
        'status'
    ];

    public function sppg()
    {
        return $this->belongsTo(User::class, 'sppg_id');
    }

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class, 'sekolah_id');
    }

    public function menu()
    {
        return $this->belongsTo(SppgMenu::class, 'menu_id');
    }
}