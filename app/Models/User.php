<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

  protected $fillable = [
    'name',
    'email',
    'password',
    'role',

    // Owner
    'nama_catering',
    'alamat_catering',

    // Kurir
    'nama_tempat_kurir',
    'alamat_tempat_kurir',

    // Operator SPPG
    'nama_sppg',
    'alamat_sppg',

    // Lokasi
    'latitude',
    'longitude',

    // Status
    'status',
];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function menus()
{
    return $this->hasMany(
        Menu::class,
        'owner_id'
    );
}
}