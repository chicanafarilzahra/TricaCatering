<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanSPPG extends Model
{
    protected $table = 'laporan_sppg';

    protected $fillable = [
        'tanggal',
        'sekolah',
        'total_paket',
        'total_penerima',
        'status',
        'catatan'
    ];
}