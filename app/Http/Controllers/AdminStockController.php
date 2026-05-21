<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class AdminStockController extends Controller
{

    public function index()
    {
        return Stock::latest()->get();
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