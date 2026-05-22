<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanHarian extends Model
{
    use HasFactory;

    protected $table = 'laporan_harian';

    protected $fillable = [
        'customer',
        'pesanan',
        'quantity',
        'waktu',
        'diterima',
        'alasan',
        'photo',
    ];
}