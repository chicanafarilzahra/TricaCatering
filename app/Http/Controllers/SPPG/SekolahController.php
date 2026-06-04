<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\User;

class SekolahController extends Controller
{
    public function index()
    {
        return User::where(
            'role',
            'klien'
        )->select(
            'id',
            'name',
            'email'
        )->get();
    }
}