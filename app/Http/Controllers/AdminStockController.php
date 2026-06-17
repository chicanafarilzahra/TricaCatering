<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockSPPG;
use Illuminate\Http\Request;

class AdminStockController extends Controller
{

    public function index()
{
    $ownerStocks = \App\Models\Stock::with('owner')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'qty' => $item->qty,
                'unit' => $item->unit,
                'minimum_stock' => $item->minimum_stock,
                'source' => 'Owner',
                'tempat' => $item->owner?->nama_catering,
            ];
        });

    $sppgStocks = \App\Models\StockSPPG::with('sppg')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'qty' => $item->qty,
                'unit' => $item->unit,
                'minimum_stock' => $item->minimum_stock,
                'source' => 'SPPG',
                'tempat' => $item->sppg?->nama_sppg,
            ];
        });

    return $ownerStocks
        ->concat($sppgStocks)
        ->values();
}

    public function store(Request $request)
    {
        $request->validate([

            'name' =>
                'required',

            'qty' =>
                'required',
        ]);

        $stock = Stock::create([

            'name' =>
                $request->name,

            'qty' =>
                $request->qty,

            'unit' =>
                $request->unit,

            'minimum_stock' =>
                $request->minimum_stock,
        ]);

        return response()->json([
            'message' =>
                'Stock berhasil ditambahkan',

            'data' => $stock
        ]);
    }

    public function show($id)
    {
        return Stock::findOrFail($id);
    }


    public function update(
        Request $request,
        $id
    ) {

        $stock = Stock::findOrFail($id);

        $stock->update($request->all());

        return response()->json([
            'message' =>
                'Stock berhasil diupdate',

            'data' => $stock
        ]);
    }


    public function destroy($id)
    {
        Stock::destroy($id);

        return response()->json([
            'message' =>
                'Stock berhasil dihapus'
        ]);
    }
}