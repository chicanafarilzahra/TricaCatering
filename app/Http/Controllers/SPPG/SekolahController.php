<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class SekolahController extends Controller
{
    // tampil semua sekolah milik SPPG
    public function index()
{
    return Sekolah::where(
        'sppg_id',
        Auth::id()
    )
    ->latest()
    ->get();
}

    // tambah sekolah
    public function store(Request $request)
{
    $request->validate([
        'nama_sekolah' => 'required|string',
        'alamat' => 'required|string',
        'jumlah_siswa' => 'required|integer',
        'latitude' => 'nullable',
        'longitude' => 'nullable',
    ]);

    $sekolah = Sekolah::create([
        'sppg_id' => Auth::id(),
        'nama_sekolah' => $request->nama_sekolah,
        'alamat' => $request->alamat,
        'jumlah_siswa' => $request->jumlah_siswa,
        'latitude' => $request->latitude,
        'longitude' => $request->longitude,
    ]);

    return response()->json($sekolah, 201);
}

    // hapus sekolah
    public function destroy($id)
    {
        Sekolah::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Berhasil dihapus'
        ]);
    }
}