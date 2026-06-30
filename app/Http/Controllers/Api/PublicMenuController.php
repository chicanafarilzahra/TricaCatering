<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SppgMenu;
use App\Models\Sekolah;

class PublicMenuController extends Controller
{
    public function index()
    {
        $sppgs = User::where('role', 'operator_sppg')
            ->where('status', 'approved')
            ->get();

        $result = $sppgs->map(function ($sppg) {

            $menu = SppgMenu::where('sppg_id', $sppg->id)
                ->where('is_active', true)
                ->latest() // ambil menu terbaru berdasarkan created_at
                ->first();

            if (!$menu) {
                return null; // SPPG ini belum punya menu aktif
            }

            $sekolah = Sekolah::where('sppg_id', $sppg->id)
                ->pluck('nama_sekolah');

            return [
                'id'        => $menu->id,
                'name'      => $menu->nama_menu,
                'tanggal'   => $menu->created_at?->toDateString(),
                'image'     => $menu->gambar
                    ? asset('storage/' . ltrim(
                        str_replace('storage/app/public/', '', $menu->gambar),
                        '/'
                      ))
                    : null,
                'sppg_name' => $sppg->nama_sppg ?? $sppg->name,
                'sekolah'   => $sekolah, // array nama sekolah
            ];
        })
        ->filter()   // buang SPPG yang belum punya menu
        ->values();

        return response()->json($result);
    }
}