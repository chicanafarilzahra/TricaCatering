<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use App\Models\Distribusi;
use App\Models\MenuHarian;

class DashboardSPPGController extends Controller
{
    public function index()
    {
        return response()->json([

            'total_sekolah' =>
                Sekolah::count(),

            'total_siswa' =>
                Sekolah::sum('jumlah_siswa'),

            'distribusi_hari_ini' =>
                Distribusi::whereDate(
                    'tanggal',
                    today()
                )->sum('jumlah_porsi'),

            'menu_hari_ini' =>
                MenuHarian::whereDate(
                    'tanggal',
                    today()
                )->count(),

            'jadwal' =>
                Distribusi::with(
                    'sekolah'
                )
                ->whereDate(
                    'tanggal',
                    today()
                )
                ->get()
                ->map(function ($item) {

                    return [
                        'id' =>
                            $item->id,

                        'nama_sekolah' =>
                            $item->sekolah->nama,

                        'jumlah_siswa' =>
                            $item->sekolah->jumlah_siswa,

                        'jumlah_porsi' =>
                            $item->jumlah_porsi,
                    ];

                }),
        ]);
    }
}