<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SppgMenu;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SppgMenuController extends Controller
{
    public function index()
    {
        return SppgMenu::where('sppg_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($menu) {
                return array_merge($menu->toArray(), [
                    'gambar_url' => $menu->gambar
                        ? Storage::url($menu->gambar)
                        : null,
                ]);
            });
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_menu' => 'required|string|max:255',
            'kalori'      => 'nullable|numeric',
            'protein'     => 'nullable|numeric',
            'karbohidrat' => 'nullable|numeric',
            'lemak'       => 'nullable|numeric',
            'serat'       => 'nullable|numeric',
        ]);

        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('sppg/menus', 'public');
        }

        $menu = SppgMenu::create([
            'sppg_id'     => Auth::id(),
            'nama_menu'   => $request->nama_menu,
            'deskripsi'   => $request->deskripsi,
            'tanggal' => $request->tanggal,
            'harga'       => $request->harga ?? 0,
            'kalori'      => $request->kalori,
            'protein'     => $request->protein,
            'karbohidrat' => $request->karbohidrat,
            'lemak'       => $request->lemak,
            'serat'       => $request->serat,
            'gambar'      => $gambarPath,
            'is_active'   => true,
        ]);

        return response()->json(array_merge($menu->toArray(), [
            'gambar_url' => $gambarPath ? Storage::url($gambarPath) : null,
        ]), 201);
    }

    public function update(Request $request, $id)
    {
        $menu = SppgMenu::where('id', $id)
            ->where('sppg_id', Auth::id())
            ->firstOrFail();

        $gambarPath = $menu->gambar;
        if ($request->hasFile('gambar')) {
            // hapus gambar lama
            if ($gambarPath) Storage::disk('public')->delete($gambarPath);
            $gambarPath = $request->file('gambar')->store('sppg/menus', 'public');
        }

        $menu->update([
            'nama_menu'   => $request->nama_menu   ?? $menu->nama_menu,
            'deskripsi'   => $request->deskripsi   ?? $menu->deskripsi,
            'tanggal' => $request->tanggal,
            'harga'       => $request->harga        ?? $menu->harga,
            'kalori'      => $request->kalori       ?? $menu->kalori,
            'protein'     => $request->protein      ?? $menu->protein,
            'karbohidrat' => $request->karbohidrat  ?? $menu->karbohidrat,
            'lemak'       => $request->lemak        ?? $menu->lemak,
            'serat'       => $request->serat        ?? $menu->serat,
            'gambar'      => $gambarPath,
            'is_active'   => $request->has('is_active') ? $request->is_active : $menu->is_active,
        ]);

        return response()->json(array_merge($menu->toArray(), [
            'gambar_url' => $gambarPath ? Storage::url($gambarPath) : null,
        ]));
    }

    public function destroy($id)
    {
        $menu = SppgMenu::where('id', $id)
            ->where('sppg_id', Auth::id())
            ->firstOrFail();

        if ($menu->gambar) {
            Storage::disk('public')->delete($menu->gambar);
        }

        $menu->delete();

        return response()->json(['message' => 'Menu berhasil dihapus']);
    }
}