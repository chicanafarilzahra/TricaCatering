<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;

class RiwayatSPPGController extends Controller
{
    public function index()
    {
        $data = Distribusi::with([
            'sekolah',
            'menu'
        ])
        ->latest()
        ->get();

        return response()->json([
            'summary' => [

                'total_distribusi' =>
                    Distribusi::count(),

                'total_porsi' =>
                    Distribusi::sum(
                        'jumlah_porsi'
                    ),

                'berhasil' =>
                    Distribusi::where(
                        'status',
                        'selesai'
                    )->count(),

                'gagal' =>
                    Distribusi::where(
                        'status',
                        'gagal'
                    )->count(),
            ],

            'data' => $data
        ]);
    }
}