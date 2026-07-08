<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DistribusiReport extends Model
{
    protected $fillable = [
        'distribusi_id', 'kurir_id', 'nama_sekolah', 'menu', 'jumlah_porsi',
        'jam_berangkat', 'jam_tiba', 'status_distribusi', 'nama_penerima',
        'status_penerimaan', 'kondisi_makanan', 'photo', 'catatan',
    ];

    public function distribusi()
    {
        return $this->belongsTo(Distribusi::class);
    }

    public function kurir()
    {
        return $this->belongsTo(\App\Models\User::class, 'kurir_id');
    }
}