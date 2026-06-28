<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StockSPPG;

class StocksSPPGController extends Controller
{
    public function index(Request $request)
    {
        $stocks = StockSPPG::where(
            'sppg_id',
            $request->user()->id
        )->latest()->get();

        return response()->json([
            'summary' => [
                'total_bahan' => $stocks->count(),

                'stok_aman' => $stocks
                    ->filter(fn ($s) => $s->qty > 0 && $s->qty > $s->minimum_stock)
                    ->count(),

                'stok_menipis' => $stocks
                    ->filter(fn ($s) => $s->qty > 0 && $s->qty <= $s->minimum_stock)
                    ->count(),

                'stok_habis' => $stocks
                    ->filter(fn ($s) => $s->qty <= 0)
                    ->count(),
            ],

            'stocks' => $stocks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'qty' => 'required|numeric',
            'unit' => 'required|string|max:50',
            'minimum_stock' => 'required|numeric',
        ]);

        $stock = StockSPPG::create([
            'sppg_id' => $request->user()->id,
            'name' => $request->name,
            'qty' => $request->qty,
            'unit' => $request->unit,
            'minimum_stock' => $request->minimum_stock,
        ]);

        return response()->json([
            'message' => 'Stok berhasil ditambahkan',
            'data' => $stock
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $stock = StockSPPG::findOrFail($id);

        $stock->update([
            'name' => $request->name,
            'qty' => $request->qty,
            'unit' => $request->unit,
            'minimum_stock' => $request->minimum_stock,
        ]);

        return response()->json([
            'message' => 'Stok berhasil diperbarui',
            'data' => $stock
        ]);
    }

    public function destroy(int $id)
    {
        StockSPPG::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Stok berhasil dihapus'
        ]);
    }
}