<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SppgMenu extends Model
{
    use HasFactory;

    protected $table = 'sppg_menus';

    protected $fillable = [
        'sppg_id',
        'nama_menu',
        'deskripsi',
        'harga',
        'kalori',
        'protein',
        'karbohidrat',
        'lemak',
        'serat',    // ✅ tambah
        'gambar',   // ✅ tambah
        'is_active',
    ];

    public function sppg()
    {
        return $this->belongsTo(
            User::class,
            'sppg_id'
        );
    }
}