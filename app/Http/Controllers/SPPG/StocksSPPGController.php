<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stock;

class StocksSPPGController extends Controller
{
    public function index(Request $request)
    {
        $stocks = Stock::where(
            'sppg_id',
            $request->user()->id
        )->latest()->get();

        return response()->json([
            'summary' => [
                'total_bahan' => $stocks->count(),

                'stok_aman' => $stocks
                    ->where('qty', '>', 20)
                    ->count(),

                'stok_menipis' => $stocks
                    ->where('qty', '>', 0)
                    ->where('qty', '<=', 20)
                    ->count(),

                'stok_habis' => $stocks
                    ->where('qty', '<=', 0)
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

        $stock = Stock::create([
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
        $stock = Stock::findOrFail($id);

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
        Stock::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Stok berhasil dihapus'
        ]);
    }
}