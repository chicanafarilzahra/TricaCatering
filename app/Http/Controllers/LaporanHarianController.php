<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LaporanHarian;

class LaporanHarianController extends Controller
{
    public function index(Request $request)
    {
        // FIX: sebelumnya mengembalikan SEMUA laporan dari semua kurir
        // (LaporanHarian::latest()->get() tanpa filter). Sekarang hanya
        // laporan milik kurir yang sedang login, berdasarkan user_id.
        $laporan = LaporanHarian::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($laporan);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer' => 'required|string',
            'pesanan' => 'required|string',
            'quantity' => 'required|integer',
            'waktu' => 'required',
            'diterima' => 'required|boolean',
            'alasan' => 'nullable|string',
            'photo' => 'nullable|file',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos', 'public');
        }

        $laporan = LaporanHarian::create([
            // FIX: simpan user_id supaya laporan ini terikat ke kurir
            // yang membuatnya — sebelumnya tidak diisi sama sekali.
            'user_id' => $request->user()->id,
            'customer' => $request->customer,
            'pesanan' => $request->pesanan,
            'quantity' => $request->quantity,
            'waktu' => $request->waktu,
            'diterima' => $request->diterima,
            'alasan' => $request->alasan,
            'photo' => $photoPath,
        ]);

        return response()->json($laporan, 201);
    }
}