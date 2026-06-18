<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SekolahController extends Controller
{
    /**
     * List sekolah milik SPPG login
     */
    public function index()
    {
        return Sekolah::where('sppg_id', Auth::id())
            ->latest()
            ->get();
    }

    /**
     * Tambah sekolah
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_sekolah' => 'required|string|max:255',
            'jenjang'      => 'required|in:TK,SD,SMP,SMA,SMK',
            'alamat'       => 'required|string',
            'jumlah_siswa' => 'required|integer|min:1',
            'latitude'     => 'required|numeric',
            'longitude'    => 'required|numeric',
        ]);

        $sekolah = Sekolah::create([
            'sppg_id'       => Auth::id(),
            'nama_sekolah'  => $request->nama_sekolah,
            'jenjang'       => $request->jenjang,
            'alamat'        => $request->alamat,
            'jumlah_siswa'  => $request->jumlah_siswa,
            'latitude'      => $request->latitude,
            'longitude'     => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Sekolah berhasil ditambahkan',
            'data'    => $sekolah,
        ], 201);
    }

    /**
     * Update sekolah
     */
    public function update(Request $request, int $id)
    {
        $request->validate([
            'nama_sekolah' => 'required|string|max:255',
            'jenjang'      => 'required|in:TK,SD,SMP,SMA,SMK',
            'alamat'       => 'required|string',
            'jumlah_siswa' => 'required|integer|min:1',
            'latitude'     => 'required|numeric',
            'longitude'    => 'required|numeric',
        ]);

        $sekolah = Sekolah::where('sppg_id', Auth::id())
            ->findOrFail($id);

        $sekolah->update([
            'nama_sekolah' => $request->nama_sekolah,
            'jenjang'      => $request->jenjang,
            'alamat'       => $request->alamat,
            'jumlah_siswa' => $request->jumlah_siswa,
            'latitude'     => $request->latitude,
            'longitude'    => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Sekolah berhasil diupdate',
            'data'    => $sekolah,
        ]);
    }

    /**
     * Hapus sekolah
     */
    public function destroy(int $id)
    {
        $sekolah = Sekolah::where('sppg_id', Auth::id())
            ->findOrFail($id);

        $sekolah->delete();

        return response()->json([
            'message' => 'Sekolah berhasil dihapus',
        ]);
    }
}