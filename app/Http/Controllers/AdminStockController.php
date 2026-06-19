<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockSPPG;
use Illuminate\Http\Request;

class AdminStockController extends Controller
{

    public function index()
{
    $owners = \App\Models\User::where(
        'role',
        'owner'
    )
    ->whereNotNull('nama_catering')
    ->get()
    ->map(function ($owner) {

        return [
            'id' => $owner->id,
            'tempat' => $owner->nama_catering,
            'source' => 'Owner',
            'jumlah_bahan' => Stock::where(
                'owner_id',
                $owner->id
            )->count(),
        ];

    });

    $sppgs = \App\Models\User::where(
        'role',
        'operator_sppg'
    )
    ->whereNotNull('nama_sppg')
    ->get()
    ->map(function ($sppg) {

        return [
            'id' => $sppg->id,
            'tempat' => $sppg->nama_sppg,
            'source' => 'SPPG',
            'jumlah_bahan' => StockSPPG::where(
                'sppg_id',
                $sppg->id
            )->count(),
        ];

    });

    return $owners
        ->concat($sppgs)
        ->values();
}

public function detailOwner($id)
{
    return response()->json([
        'owner_id' => $id,
        'data' => Stock::where(
            'owner_id',
            $id
        )->get()
    ]);
}

public function detailSPPG($id)
{
    return StockSPPG::where(
        'sppg_id',
        $id
    )->get();
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