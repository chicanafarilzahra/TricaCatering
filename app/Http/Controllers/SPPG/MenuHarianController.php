<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Menu;

class MenuHarianController extends Controller
{
    public function index()
    {
        // ambil semua menu aktif
        $menus = Menu::where('is_active', true)
            ->orderBy('name')
            ->get();

        // ambil menu hari ini (contoh: first active)
        $menuHarian = $menus->first();

        return response()->json([
            "menu_harian" => $menuHarian ? [
                "id" => $menuHarian->id,
                "nama_menu" => $menuHarian->name,
                "gambar_menu" => $menuHarian->image,
                "detail_menu" => [
                    $menuHarian->description ?? "Menu bergizi seimbang"
                ],
                "catatan" => "Menu harian SPPG disusun sesuai standar gizi"
            ] : null,

            // GIZI (sementara dari data menu / bisa kamu extend nanti)
            "gizi" => $menuHarian ? [
                "energi" => 650,
                "protein" => 25,
                "lemak" => 20,
                "karbohidrat" => 90,

                "akg" => [
                    ["label" => "Energi", "value" => 70],
                    ["label" => "Protein", "value" => 80],
                    ["label" => "Lemak", "value" => 60],
                    ["label" => "Karbohidrat", "value" => 75],
                ]
            ] : null,

            // menu mingguan (dummy dari DB biar jalan dulu)
            "menu_mingguan" => $menus->take(5)->map(function ($menu, $i) {
                return [
                    "id" => $menu->id,
                    "hari" => ["Senin","Selasa","Rabu","Kamis","Jumat"][$i],
                    "menu" => $menu->name
                ];
            })->values()
        ]);
    }
}