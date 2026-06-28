<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Support\Facades\Auth;

class RiwayatSPPGController extends Controller
{
    public function index()
    {
        $sppgId = Auth::id();

        $data = Distribusi::with(['sekolah', 'menu'])
            ->where('sppg_id', $sppgId)
            ->latest()
            ->get();

        return response()->json([
            'summary' => [
                'total_distribusi' => Distribusi::where('sppg_id', $sppgId)->count(),
                'total_porsi'      => Distribusi::where('sppg_id', $sppgId)->sum('jumlah_porsi'),
                'berhasil'         => Distribusi::where('sppg_id', $sppgId)->where('status', 'selesai')->count(),
                'gagal'            => Distribusi::where('sppg_id', $sppgId)->where('status', 'gagal')->count(),
            ],
            'data' => $data
        ]);
    }
}