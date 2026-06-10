<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sekolah extends Model
{
    protected $fillable = [
        'sppg_id',
        'nama_sekolah',
        'alamat',
        'jumlah_siswa',
        'latitude',
        'longitude',
    ];

    public function sppg()
    {
        return $this->belongsTo(
            User::class,
            'sppg_id'
        );
    }
}