<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use Illuminate\Http\Request;

class SekolahController extends Controller
{
    // tampil semua sekolah milik SPPG
    public function index(Request $request)
    {
        return Sekolah::where(
            'sppg_id',
            $request->sppg_id
        )
        ->latest()
        ->get();
    }

    // tambah sekolah
    public function store(Request $request)
    {
        $request->validate([
            'sppg_id' => 'required|integer',
            'nama_sekolah' => 'required|string',
            'alamat' => 'required|string',
            'jumlah_siswa' => 'required|integer',
            'latitude' => 'nullable',
            'longitude' => 'nullable',
        ]);

        $sekolah = Sekolah::create([
            'sppg_id' => $request->sppg_id,
            'nama_sekolah' => $request->nama_sekolah,
            'alamat' => $request->alamat,
            'jumlah_siswa' => $request->jumlah_siswa,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json($sekolah, 201);
    }

    // detail sekolah
    public function show($id)
    {
        return Sekolah::findOrFail($id);
    }

    // update sekolah
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_sekolah' => 'required|string',
            'alamat' => 'required|string',
            'jumlah_siswa' => 'required|integer',
            'latitude' => 'nullable',
            'longitude' => 'nullable',
        ]);

        $sekolah = Sekolah::findOrFail($id);

        $sekolah->update([
            'nama_sekolah' => $request->nama_sekolah,
            'alamat' => $request->alamat,
            'jumlah_siswa' => $request->jumlah_siswa,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json($sekolah);
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