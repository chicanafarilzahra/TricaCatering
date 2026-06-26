<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CourierController extends Controller
{
    public function index(Request $request)
{
    $owner = $request->user();

    $couriers = User::where('role', 'kurir')
    ->whereRaw('TRIM(LOWER(nama_tempat_kurir)) = ?', [trim(strtolower($owner->nama_catering))])
    ->where('status', 'approved')
    ->get([
        'id',
        'name',
        'phone',
        'email',
        'nama_tempat_kurir',
        'alamat_tempat_kurir',
        'status',
    ]);
    return response()->json($couriers);
}
}