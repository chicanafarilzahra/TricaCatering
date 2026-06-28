<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\SppgMenu;
use Illuminate\Support\Facades\Auth;

class MenuHarianController extends Controller
{
    public function index()
    {
        $menus = SppgMenu::where('sppg_id', Auth::id())
            ->where('is_active', true)
            ->latest()
            ->get();

        $menuHarian = $menus->first();

        return response()->json([

            "menu_harian" => $menuHarian ? [
                "id"         => $menuHarian->id,
                "nama_menu"  => $menuHarian->nama_menu,
                "tanggal"    => $menuHarian->created_at?->toDateString(),
                "deskripsi"  => $menuHarian->deskripsi,
                "kategori"   => $menuHarian->kategori ?? null,

                "gambar_menu" => $menuHarian->gambar
                    ? asset('storage/' . ltrim(
                        str_replace('storage/app/public/', '', $menuHarian->gambar),
                        '/'
                      ))
                    : null,

                "detail_menu" => [
                    $menuHarian->deskripsi ?? "Menu bergizi seimbang"
                ],

                "catatan" => "Menu harian SPPG disusun sesuai standar gizi",

                // field gizi langsung di menu_harian agar edit modal bisa populate
                "kalori"      => $menuHarian->kalori,
                "protein"     => $menuHarian->protein,
                "lemak"       => $menuHarian->lemak,
                "karbohidrat" => $menuHarian->karbohidrat,
                "serat"       => $menuHarian->serat,
            ] : null,

            "gizi" => $menuHarian ? [
                "energi"      => $menuHarian->kalori      ?? 0,
                "protein"     => $menuHarian->protein     ?? 0,
                "lemak"       => $menuHarian->lemak       ?? 0,
                "karbohidrat" => $menuHarian->karbohidrat ?? 0,
                "serat"       => $menuHarian->serat       ?? 0,

                "target" => [
                    "energi"      => 2000,
                    "protein"     => 60,
                    "lemak"       => 67,
                    "karbohidrat" => 300,
                    "serat"       => 25,
                ],
            ] : null,

            "menu_mingguan" => $menus->take(5)->values()->map(function ($menu, $i) {
                $hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
                return [
                    "id"   => $menu->id,
                    "hari" => $hari[$i] ?? "-",
                    "menu" => $menu->nama_menu,
                ];
            }),
        ]);
    }
}