<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SppgMenu;
use Illuminate\Support\Facades\Auth;

class SppgMenuController extends Controller
{
    public function index()
{
    return SppgMenu::where(
        'sppg_id',
        Auth::id()
    )
    ->latest()
    ->get();
}

    public function store(Request $request)
{
    dd($request->all());

    $request->validate([
        'nama_menu' => 'required',
    ]);

    return SppgMenu::create([
        'sppg_id' => Auth::id(),
        'nama_menu' => $request->nama_menu,
        'deskripsi' => $request->deskripsi,
        'harga' => $request->harga,
        'kalori' => $request->kalori,
        'protein' => $request->protein,
        'karbohidrat' => $request->karbohidrat,
        'lemak' => $request->lemak,
        'is_active' => true,
    ]);
}

    public function update(Request $request, $id)
{
    $menu = SppgMenu::where(
        'id',
        $id
    )
    ->where(
        'sppg_id',
        Auth::id()
    )
    ->firstOrFail();

    $menu->update([
        'nama_menu' => $request->nama_menu,
        'deskripsi' => $request->deskripsi,
        'harga' => $request->harga,
        'kalori' => $request->kalori,
        'protein' => $request->protein,
        'karbohidrat' => $request->karbohidrat,
        'lemak' => $request->lemak,
        'is_active' => $request->is_active,
    ]);

    return $menu;
}

    public function destroy($id)
{
    $menu = SppgMenu::where(
        'id',
        $id
    )
    ->where(
        'sppg_id',
        Auth::id()
    )
    ->firstOrFail();

    $menu->delete();

    return response()->json([
        'message' => 'Menu berhasil dihapus'
    ]);
}
}