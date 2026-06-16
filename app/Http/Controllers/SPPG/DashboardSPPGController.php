<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardSPPGController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $totalSekolah = DB::table('sekolahs')
            ->where('sppg_id', $userId)
            ->count();

        $totalSiswa = DB::table('sekolahs')
            ->where('sppg_id', $userId)
            ->sum('jumlah_siswa');

        $menuHariIni = DB::table('sppg_menus')
            ->where('sppg_id', $userId)
            ->where('is_active', 1)
            ->count();

        $totalDistribusi = DB::table('distribusis')
            ->where('sppg_id', $userId)
            ->sum('jumlah_porsi');

        $jadwal = DB::table('distribusis')
            ->join(
                'sekolahs',
                'distribusis.sekolah_id',
                '=',
                'sekolahs.id'
            )
            ->where('distribusis.sppg_id', $userId)
            ->select(
                'distribusis.id',
                'sekolahs.nama_sekolah',
                'distribusis.jumlah_porsi',
                'distribusis.tanggal',
                'distribusis.status'
            )
            ->get();

        $activities = [];

        $menus = DB::table('sppg_menus')
            ->where('sppg_id', $userId)
            ->latest('id')
            ->take(3)
            ->get();

        foreach ($menus as $menu) {
            $activities[] = [
                'title' => 'Menu "' . $menu->nama_menu . '" ditambahkan',
                'time' => Carbon::parse($menu->created_at)->diffForHumans(),
            ];
        }

        $sekolahs = DB::table('sekolahs')
            ->where('sppg_id', $userId)
            ->latest('id')
            ->take(3)
            ->get();

        foreach ($sekolahs as $sekolah) {
            $activities[] = [
                'title' => 'Sekolah "' . $sekolah->nama_sekolah . '" ditambahkan',
                'time' => Carbon::parse($sekolah->created_at)->diffForHumans(),
            ];
        }

        return response()->json([
            'total_sekolah' => $totalSekolah,
            'total_siswa' => $totalSiswa,
            'menu_hari_ini' => $menuHariIni,
            'distribusi_hari_ini' => $totalDistribusi,
            'jadwal' => $jadwal,
            'activities' => collect($activities)->values(),
        ]);
    }
}