<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sekolah extends Model
{
    protected $fillable = [

        'nama_sekolah',
        'jenjang',
        'alamat',
        'jumlah_siswa'

    ];

    public function sppgs()
    {
        return $this->belongsToMany(
            User::class,
            'sppg_sekolah'
        );
    }
}