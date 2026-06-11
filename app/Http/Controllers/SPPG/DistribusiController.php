<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Http\Request;

class DistribusiController extends Controller
{
    // Menampilkan semua distribusi milik SPPG
    public function index(Request $request)
    {
        return Distribusi::with([
                'sekolah',
                'menu'
            ])
            ->where('sppg_id', $request->user()->id)
            ->latest()
            ->get();
    }

    // Menambahkan distribusi
    public function store(Request $request)
    {
        $request->validate([
            'sekolah_id' => 'required|integer',
            'menu_id' => 'required|integer',
            'tanggal' => 'required|date',
            'jumlah_porsi' => 'required|integer',
            'status' => 'nullable|string',
        ]);

        $distribusi = Distribusi::create([
            'sppg_id' => $request->user()->id,
            'sekolah_id' => $request->sekolah_id,
            'menu_id' => $request->menu_id,
            'tanggal' => $request->tanggal,
            'jumlah_porsi' => $request->jumlah_porsi,
            'status' => $request->status ?? 'Diproses',
        ]);

        return response()->json($distribusi, 201);
    }

    // Detail distribusi
    public function show($id)
    {
        return Distribusi::with([
                'sekolah',
                'menu'
            ])
            ->findOrFail($id);
    }

    // Update distribusi
    public function update(Request $request, $id)
    {
        $request->validate([
            'sekolah_id' => 'required|integer',
            'menu_id' => 'required|integer',
            'tanggal' => 'required|date',
            'jumlah_porsi' => 'required|integer',
            'status' => 'required|string',
        ]);

        $distribusi = Distribusi::findOrFail($id);

        $distribusi->update([
            'sekolah_id' => $request->sekolah_id,
            'menu_id' => $request->menu_id,
            'tanggal' => $request->tanggal,
            'jumlah_porsi' => $request->jumlah_porsi,
            'status' => $request->status,
        ]);

        return response()->json($distribusi);
    }

    // Hapus distribusi
    public function destroy($id)
    {
        $distribusi = Distribusi::findOrFail($id);

        $distribusi->delete();

        return response()->json([
            'message' => 'Distribusi berhasil dihapus'
        ]);
    }
}