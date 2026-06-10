<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use Illuminate\Http\Request;

class OwnerStockController extends Controller
{
    public function index()
    {
        return Stock::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'qty' => 'required|numeric',
            'unit' => 'required',
            'minimum_stock' => 'required|numeric',
        ]);

        $stock = Stock::create([
            'name' => $request->name,
            'qty' => $request->qty,
            'unit' => $request->unit,
            'minimum_stock' => $request->minimum_stock,
        ]);

        return response()->json($stock,201);
    }

    public function update(Request $request,$id)
    {
        $stock = Stock::findOrFail($id);

        $stock->update([
            'name'=>$request->name,
            'qty'=>$request->qty,
            'unit'=>$request->unit,
            'minimum_stock'=>$request->minimum_stock,
        ]);

        return response()->json($stock);
    }

    public function destroy($id)
    {
        Stock::findOrFail($id)->delete();

        return response()->json([
            'message'=>'deleted'
        ]);
    }
}