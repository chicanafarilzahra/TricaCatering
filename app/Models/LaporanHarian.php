<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanHarian extends Model
{
    use HasFactory;

    protected $table = 'laporan_harian';

    protected $fillable = [
        // FIX: user_id belum ada di fillable sebelumnya, jadi
        // LaporanHarianController::store() yang mengisi 'user_id'
        // selalu dibuang diam-diam oleh mass assignment protection.
        // Akibatnya index() (yang filter by user_id) selalu kosong.
        'user_id',
        'customer',
        'pesanan',
        'quantity',
        'waktu',
        'diterima',
        'alasan',
        'photo',
        'delivery_fee',
    ];
}