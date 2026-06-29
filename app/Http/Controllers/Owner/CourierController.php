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
            ->where('owner_id', $owner->id)
            ->where('status', 'approved')
            ->get([
                'id',
                'name',
                'phone',
                'email',
                'is_available',
                'nama_tempat_kurir',
                'alamat_tempat_kurir',
                'status',
            ]);

        return response()->json($couriers);
    }
}