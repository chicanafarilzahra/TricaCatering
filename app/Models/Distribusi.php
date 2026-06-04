<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribusi extends Model
{
    protected $table = 'distribusi';

    protected $fillable = [

        'school_id',
        'tanggal',
        'jumlah_porsi',
        'jam_kirim',
        'status'
    ];

    public function school()
    {
        return $this->belongsTo(
            School::class
        );
    }
}
