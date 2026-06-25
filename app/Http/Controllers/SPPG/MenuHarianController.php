<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\SppgMenu;
use Illuminate\Support\Facades\Auth;

class MenuHarianController extends Controller
{
    public function index()
    {
        $menus = SppgMenu::where(
                'sppg_id',
                Auth::id()
            )
            ->where(
                'is_active',
                true
            )
            ->latest()
            ->get();

        $menuHarian = $menus->first();

        return response()->json([

            "menu_harian" => $menuHarian ? [

                "id" => $menuHarian->id,

                "nama_menu" =>
                    $menuHarian->nama_menu,

                "gambar_menu" => null,

                "detail_menu" => [
                    $menuHarian->deskripsi
                        ?? "Menu bergizi seimbang"
                ],

                "catatan" =>
                    "Menu harian SPPG disusun sesuai standar gizi"

            ] : null,

            "gizi" => $menuHarian ? [

                "energi" =>
                    $menuHarian->kalori ?? 0,

                "protein" =>
                    $menuHarian->protein ?? 0,

                "lemak" =>
                    $menuHarian->lemak ?? 0,

                "karbohidrat" =>
                    $menuHarian->karbohidrat ?? 0,

                "akg" => [

                    [
                        "label" => "Energi",
                        "value" => 70
                    ],

                    [
                        "label" => "Protein",
                        "value" => 80
                    ],

                    [
                        "label" => "Lemak",
                        "value" => 60
                    ],

                    [
                        "label" => "Karbohidrat",
                        "value" => 75
                    ]
                ]

            ] : null,

            "menu_mingguan" => $menus
                ->take(5)
                ->values()
                ->map(function ($menu, $i) {

                    $hari = [
                        "Senin",
                        "Selasa",
                        "Rabu",
                        "Kamis",
                        "Jumat"
                    ];

                    return [
                        "id" => $menu->id,
                        "hari" => $hari[$i] ?? "-",
                        "menu" => $menu->nama_menu
                    ];
                })
        ]);
    }
}