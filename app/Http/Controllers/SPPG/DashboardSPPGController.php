<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DashboardSPPGController extends Controller
{
    public function index()
    {
        $totalSekolah =
            DB::table('sekolahs')->count();

        $totalSiswa =
            DB::table('sekolahs')
                ->sum('jumlah_siswa');

        $menuHariIni =
            DB::table('menus')
                ->where('is_active', 1)
                ->count();

        $jadwal =
            DB::table('sekolahs')
                ->select(
                    'id',
                    'nama_sekolah',
                    'jumlah_siswa',
                    DB::raw('jumlah_siswa as jumlah_porsi')
                )
                ->get();

        $activities = [];

        // aktivitas dari menu terbaru
        $menus =
            DB::table('menus')
                ->latest('id')
                ->take(3)
                ->get();

        foreach ($menus as $menu) {
            $activities[] = [
                'title' =>
                    'Menu "' . $menu->name . '" ditambahkan',
                'time' =>
                    \Carbon\Carbon::parse(
                        $menu->created_at
                    )->diffForHumans(),
            ];
        }

        // aktivitas dari sekolah terbaru
        $sekolahs =
            DB::table('sekolahs')
                ->latest('id')
                ->take(2)
                ->get();

        foreach ($sekolahs as $sekolah) {
            $activities[] = [
                'title' =>
                    'Sekolah "' .
                    $sekolah->nama_sekolah .
                    '" terdaftar',
                'time' =>
                    \Carbon\Carbon::parse(
                        $sekolah->created_at
                    )->diffForHumans(),
            ];
        }

        return response()->json([
            'total_sekolah' =>
                $totalSekolah,

            'total_siswa' =>
                $totalSiswa,

            'menu_hari_ini' =>
                $menuHariIni,

            'distribusi_hari_ini' =>
                $totalSiswa,

            'jadwal' =>
                $jadwal,

            'activities' =>
                collect($activities)
                    ->sortByDesc('time')
                    ->values(),
        ]);
    }
}