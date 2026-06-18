<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Sekolah extends Model
{
    protected $fillable = [
        'sppg_id',
        'nama_sekolah',
        'jenjang',
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