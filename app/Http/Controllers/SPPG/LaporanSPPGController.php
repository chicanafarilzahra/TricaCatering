<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Support\Facades\DB;

class LaporanSPPGController extends Controller
{
    public function index()
    {
        $laporan =
            Distribusi::select(
                'tanggal',
                DB::raw('SUM(jumlah_porsi) as total_porsi'),
                DB::raw('COUNT(*) as total_distribusi')
            )
            ->groupBy('tanggal')
            ->orderByDesc('tanggal')
            ->get();

        return response()->json([
            'summary' => [

                'total_distribusi' =>
                    Distribusi::count(),

                'total_porsi' =>
                    Distribusi::sum(
                        'jumlah_porsi'
                    ),

                'total_sekolah' =>
                    Distribusi::distinct(
                        'sekolah_id'
                    )->count(),

                'total_sppg' =>
                    Distribusi::distinct(
                        'sppg_id'
                    )->count(),
            ],

            'data' => $laporan
        ]);
    }
}