<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Menu;

class MenuHarianController extends Controller
{
    public function index()
    {
        return Menu::where(
            'is_active',
            true
        )->orderBy(
            'name'
        )->get();
    }
}