<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Sekolah;


class DistribusiController extends Controller
{
    // Menampilkan distribusi: admin lihat semua, SPPG lihat milik sendiri
    public function index(Request $request)
    {
        $query = Distribusi::with([
            'sekolah',
            'menu'
        ]);

        if ($request->user()->role !== 'admin') {
            $query->where(
                'sppg_id',
                Auth::id()
            );
        }

        return $query->latest()->get();
    }

    // Menambahkan distribusi
   public function store(Request $request)
{
    $request->validate([
        'sekolah_id' => 'required|exists:sekolahs,id',
        'menu_id' => 'required|exists:sppg_menus,id',
        'tanggal' => 'required|date',
        'jam_distribusi' => 'required',
    ]);

    $sekolah = Sekolah::findOrFail(
        $request->sekolah_id
    );

    return Distribusi::create([
    'sppg_id' => Auth::id(),
    'sekolah_id' => $request->sekolah_id,
    'menu_id' => $request->menu_id,
    'tanggal' => $request->tanggal,
    'jam_distribusi' => $request->jam_distribusi,
    'jumlah_porsi' => $sekolah->jumlah_siswa,
    'status' => $request->status ?? 'Diproses',
]);
}
    // Detail distribusi
    public function show($id)
{
    return Distribusi::with([
        'sekolah',
        'menu'
    ])
    ->where(
        'sppg_id',
        Auth::id()
    )
    ->findOrFail($id);
}

    // Update distribusi
    public function update(Request $request,$id)
{
    $data = Distribusi::where(
        'id',
        $id
    )
    ->where(
        'sppg_id',
        Auth::id()
    )
    ->firstOrFail();

    $sekolah = Sekolah::findOrFail(
        $request->sekolah_id
    );

    $data->update([
        'sekolah_id' => $request->sekolah_id,
        'menu_id' => $request->menu_id,
        'tanggal' => $request->tanggal,
        'jam_distribusi' => $request->jam_distribusi,
        'jumlah_porsi' => $sekolah->jumlah_siswa,
        'status' => $request->status,
    ]);

    return $data;
}
    // Hapus distribusi
    public function destroy($id)
    {
        $distribusi = Distribusi::where(
            'id',
            $id
        )
        ->where(
            'sppg_id',
            Auth::id()
        )
        ->firstOrFail();

        $distribusi->delete();

        return response()->json([
            'message' => 'Distribusi berhasil dihapus'
        ]);
    }
}