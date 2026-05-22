<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LaporanHarian;

class LaporanHarianController extends Controller
{
    public function index()
    {
        // ambil semua laporan harian
        return response()->json(LaporanHarian::latest()->get());
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