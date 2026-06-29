<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LaporanSPPGController extends Controller
{
    public function index()
    {
        $sppgId = Auth::id();

        $laporan = Distribusi::select(
                'tanggal',
                DB::raw('SUM(jumlah_porsi) as total_porsi'),
                DB::raw('COUNT(*) as total_distribusi')
            )
            ->where('sppg_id', $sppgId)
            ->groupBy('tanggal')
            ->orderByDesc('tanggal')
            ->get();

        return response()->json([
            'summary' => [
                'total_distribusi' => Distribusi::where('sppg_id', $sppgId)->count(),
                'total_porsi'      => Distribusi::where('sppg_id', $sppgId)->sum('jumlah_porsi'),
                'total_sekolah'    => Distribusi::where('sppg_id', $sppgId)->distinct('sekolah_id')->count('sekolah_id'),
                'total_sppg'       => 1,
            ],
            'data' => $laporan
        ]);
    }
}