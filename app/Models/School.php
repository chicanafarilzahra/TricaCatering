<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [

        'name',
        'level',
        'student_count',
        'address',
        'latitude',
        'longitude'
    ];
}